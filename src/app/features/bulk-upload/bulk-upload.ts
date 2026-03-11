import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../core/services/cardService';
import { Franchise, TradeType, CardCondition, CardLanguage, Currency, CardPost, RARITIES_BY_FRANCHISE, SETS_BY_FRANCHISE, SETS_BY_FRANCHISE_JP } from '../../core/models/site-config.model';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast';

@Component({
    selector: 'app-bulk-upload',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './bulk-upload.html'
})
export class BulkUploadComponent {
    private cardService = inject(CardService);
    private router = inject(Router);
    private toastService = inject(ToastService);

    public isParsing = signal(false);
    public isUploading = signal(false);
    public parsedCards = signal<any[]>([]);
    public globalWhatsApp = signal('');
    public globalType = signal<TradeType>(TradeType.VENDO);
    public globalFranchise = signal<Franchise>(Franchise.POKEMON);
    public globalLanguage = signal<CardLanguage>(CardLanguage.ES);

    public franchises = Object.values(Franchise);

    // Mapa para guardar los archivos seleccionados: nombre de archivo -> Objeto File
    public selectedImages = signal<Map<string, File>>(new Map());

    public uploadProgress = signal(0);
    public uploadTotal = signal(0);

    public TradeType = TradeType;

    public currentRarities = computed(() => {
        const f = this.globalFranchise();
        return RARITIES_BY_FRANCHISE[f] || [];
    });

    public currentSets = computed(() => {
        const f = this.globalFranchise();
        const l = this.globalLanguage();
        const catalog = (l === CardLanguage.JP) ? SETS_BY_FRANCHISE_JP : SETS_BY_FRANCHISE;
        const series = catalog[f] || [];
        // Aplanamos todas las series para obtener una lista única de sets para búsqueda/plantilla
        return series.flatMap(s => s.sets);
    });

    public allowedConditions = [
        { key: 'm / mint', label: 'Mint (Impecable)' },
        { key: 'nm / near', label: 'Near Mint (Casi Nueva)' },
        { key: 'lp / ex', label: 'Excellent (Excelente)' },
        { key: 'mp / play', label: 'Played (Usada)' },
        { key: 'hp / heavy', label: 'Heavy Played (Muy Usada)' }
    ];

    public allowedLanguages = [
        { key: 'es', label: 'Español' },
        { key: 'en / ing', label: 'Inglés' },
        { key: 'jp', label: 'Japonés' }
    ];

    public canSubmit = computed(() => this.parsedCards().length > 0 && this.globalWhatsApp().length >= 10);

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.isParsing.set(true);
        const reader = new FileReader();

        reader.onload = (e: any) => {
            const text = e.target.result;
            this.parseCSV(text);
            this.isParsing.set(false);
        };

        reader.readAsText(file);
    }

    private parseCSV(text: string) {
        // Filtramos las líneas que no son comentarios y no están vacías
        const allLines = text.split('\n').map(l => l.trim());
        const dataLines = allLines.filter(line => line && !line.startsWith('#'));

        if (dataLines.length < 1) return;

        const headers = dataLines[0].split(',').map(h => h.trim().toLowerCase());
        const cards: Partial<CardPost>[] = [];

        for (let i = 1; i < dataLines.length; i++) {
            const line = dataLines[i];
            const values = line.split(',').map(v => v.trim());
            const card: any = {
                franchise: this.globalFranchise()
            };

            headers.forEach((header, index) => {
                const val = values[index];
                if (!val) return;

                if (header.includes('nombre')) card.cardName = val;
                if (header.includes('moneda')) card.currency = val.toUpperCase() === 'USD' ? Currency.USD : Currency.ARS;
                if (header.includes('precio')) card.price = parseFloat(val) || 0;
                if (header.includes('rareza')) card.rarity = val as any;
                if (header.includes('estado')) card.condition = this.mapCondition(val);
                if (header.includes('idioma')) card.language = this.mapLanguage(val);
                if (header.includes('foto')) card.photoName = val;
                if (header.includes('set')) {
                    const cardLang = card.language || CardLanguage.ES;
                    const catalog = (cardLang === CardLanguage.JP) ? SETS_BY_FRANCHISE_JP : SETS_BY_FRANCHISE;
                    const franchiseCatalog = catalog[this.globalFranchise()] || [];
                    const flatSets = franchiseCatalog.flatMap(s => s.sets);

                    const foundSet = flatSets.find(s => 
                        s.id.toLowerCase() === val.toLowerCase() || 
                        s.name.toLowerCase().includes(val.toLowerCase())
                    );
                    if (foundSet) {
                        card.setName = foundSet.name;
                        card.setCode = foundSet.id;
                    } else {
                        card.setName = val; // Fallback al nombre literal
                    }
                }
                if (header.includes('numero') || header.includes('num')) card.cardNumber = val;
            });

            if (card.cardName) {
                cards.push(card);
            }
        }

        this.parsedCards.set(cards);
    }

    private mapFranchise(val: string): Franchise {
        const v = val.toLowerCase();
        if (v.includes('poke')) return Franchise.POKEMON;
        if (v.includes('magic')) return Franchise.MAGIC;
        if (v.includes('yugi')) return Franchise.YUGIOH;
        if (v.includes('piece')) return Franchise.ONE_PIECE;
        if (v.includes('dragon')) return Franchise.DRAGON_BALL;
        if (v.includes('lorcana')) return Franchise.LORCANA;
        if (v.includes('digi')) return Franchise.DIGIMON;
        return Franchise.POKEMON;
    }

    private mapCondition(val: string): CardCondition {
        const v = val.toLowerCase();
        if (v.includes('mint') || v === 'm') return CardCondition.MINT;
        if (v.includes('near') || v === 'nm') return CardCondition.NEAR_MINT;
        if (v.includes('ex') || v === 'lp') return CardCondition.EXCELLENT;
        if (v.includes('play') || v === 'mp') return CardCondition.PLAYED;
        if (v.includes('heavy') || v === 'hp') return CardCondition.HEAVY_PLAYED;
        return CardCondition.NEAR_MINT;
    }

    private mapLanguage(val: string): CardLanguage {
        const v = val.toLowerCase();
        if (v.includes('es')) return CardLanguage.ES;
        if (v.includes('en') || v.includes('ing')) return CardLanguage.EN;
        if (v.includes('jp')) return CardLanguage.JP;
        return CardLanguage.ES;
    }

    onImagesSelected(event: any) {
        const files = event.target.files as FileList;
        if (!files) return;

        const newMap = new Map(this.selectedImages());
        for (let i = 0; i < files.length; i++) {
            newMap.set(files[i].name, files[i]);
        }
        this.selectedImages.set(newMap);
        this.toastService.success(`${files.length} imágenes cargadas para emparejar.`);
    }

    async submitAll() {
        if (!this.canSubmit() || this.isUploading()) return;

        this.isUploading.set(true);
        const cards = this.parsedCards();
        const imagesMap = this.selectedImages();
        this.uploadTotal.set(cards.length);
        this.uploadProgress.set(0);

        const finalBatch: Partial<CardPost>[] = [];

        try {
            for (const card of cards) {
                let imageUrl = '';
                let imagePath = '';

                // Si la carta tiene referencia a una foto y esa foto fue subida
                if (card.photoName && imagesMap.has(card.photoName)) {
                    const file = imagesMap.get(card.photoName)!;
                    try {
                        const uploadRes = await this.cardService.uploadImage(file);
                        imageUrl = uploadRes.url;
                        imagePath = uploadRes.path;
                    } catch (e) {
                        console.error(`Error subiendo foto ${card.photoName}`, e);
                    }
                }

                finalBatch.push({
                    cardName: card.cardName,
                    franchise: this.globalFranchise(), // Forzamos la global
                    price: card.price,
                    rarity: card.rarity,
                    condition: card.condition,
                    language: card.language,
                    whatsappContact: this.globalWhatsApp(),
                    type: this.globalType(),
                    currency: card.currency || Currency.ARS,
                    description: card.description || 'Publicado masivamente',
                    imageUrl: imageUrl || undefined,
                    imagePath: imagePath || undefined,
                    setName: card.setName,
                    setCode: card.setCode,
                    cardNumber: card.cardNumber
                });

                this.uploadProgress.update(v => v + 1);
            }

            // Usamos el nuevo método de batch
            await this.cardService.createBatchPosts(finalBatch);
            this.toastService.success(`¡Se publicaron ${cards.length} cartas correctamente!`);
            this.router.navigate(['/mis-anuncios']);
        } catch (error) {
            console.error('Error en subida masiva:', error);
            this.toastService.error('Error al subir las cartas.');
        } finally {
            this.isUploading.set(false);
        }
    }

    downloadTemplate() {
        const franchise = this.globalFranchise();
        const type = this.globalType();
        const lang = this.globalLanguage();
        const rarities = RARITIES_BY_FRANCHISE[franchise] || [];
        const raritiesInfo = rarities.slice(0, 10).map(r => `${r.value}`).join(' | ');
        const sets = this.currentSets();
        const setsInfo = sets.slice(0, 8).map(s => `${s.id}`).join(', ') + '...';

        // Construimos el contenido línea por línea en un array
        const lines: string[] = [];

        // 1. Comentarios de instrucción
        lines.push(`# PLANTILLA PARA: ${type.toUpperCase()}`);
        lines.push(`# FRANQUICIA: ${franchise}`);
        lines.push(`# IDIOMA BASE: ${lang}`);
        lines.push(`# RAREZAS SUGERIDAS: ${raritiesInfo}`);
        lines.push(`# SETS SUGERIDOS (${lang}): ${setsInfo}`);
        lines.push(`# ESTADOS: Mint | Near Mint | Excellent | Played | Heavy Played`);
        lines.push(`# IDIOMAS: ES (Español) | EN (Inglés) | JP (Japonés)`);

        let headers = '';
        let example = '';

        if (type === TradeType.VENDO) {
            lines.push(`# MONEDAS: ARS | USD`);
            headers = 'Nombre,Set,Numero,Precio,Moneda,Rareza,Estado,Idioma,Foto';
            example = `Charizard VMAX,SSP,185/191,15000,ARS,ULTRA_RARE,Near Mint,ES,charizard.jpg`;
        } else {
            headers = 'Nombre,Set,Numero,Rareza,Estado,Idioma,Foto';
            example = `Charizard VMAX,SSP,185/191,ULTRA_RARE,Near Mint,ES,charizard.jpg`;
        }

        // 2. Encabezados y ejemplo
        lines.push(headers);
        lines.push(example);

        // 3. Generar el string final con saltos de línea correctos
        const csvContent = lines.join('\n');

        // 4. Crear el Blob y el link de descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Nombre de archivo limpio
        const safeFranchise = franchise.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_');
        const filename = `plantilla_${type.toLowerCase()}_${safeFranchise}.csv`;

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Limpiar
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    removeCard(index: number) {
        this.parsedCards.update(cards => cards.filter((_, i) => i !== index));
    }
}
