import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../core/services/cardService';
import { Franchise, TradeType, CardCondition, CardLanguage, Currency, CardPost } from '../../core/models/site-config.model';
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

    public franchises = Object.values(Franchise);

    // Mapa para guardar los archivos seleccionados: nombre de archivo -> Objeto File
    public selectedImages = signal<Map<string, File>>(new Map());

    public uploadProgress = signal(0);
    public uploadTotal = signal(0);

    public TradeType = TradeType;

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
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        // Formato esperado: nombre, precio, rareza, estado, idioma, foto
        const cards: Partial<CardPost>[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(v => v.trim());
            const card: any = {
                franchise: this.globalFranchise() // Usamos la global
            };

            headers.forEach((header, index) => {
                const val = values[index];
                if (header.includes('nombre')) card.cardName = val;
                // if (header.includes('franquicia')) card.franchise = this.mapFranchise(val); // Removed
                if (header.includes('precio')) card.price = parseFloat(val) || 0;
                if (header.includes('rareza')) card.rarity = val as any;
                if (header.includes('estado')) card.condition = this.mapCondition(val);
                if (header.includes('idioma')) card.language = this.mapLanguage(val);
                if (header.includes('foto')) card.photoName = val; // Guardamos el nombre del archivo esperado
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
                    currency: Currency.ARS,
                    description: card.description || 'Publicado masivamente',
                    imageUrl: imageUrl || undefined,
                    imagePath: imagePath || undefined
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
        const csvContent = "data:text/csv;charset=utf-8,Nombre,Precio,Rareza,Estado,Idioma,Foto\nCharizard Base Set,50000,Rare,Near Mint,ES,charizard.jpg\nBlack Lotus,100000,Rare,Mint,EN,lotus.png";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "plantilla_tumarket.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    removeCard(index: number) {
        this.parsedCards.update(cards => cards.filter((_, i) => i !== index));
    }
}
