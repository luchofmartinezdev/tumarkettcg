import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardCondition, CardLanguage, Franchise, TradeType, RARITIES_BY_FRANCHISE, RarityOption, Currency, SETS_BY_FRANCHISE, SETS_BY_FRANCHISE_JP, SetOption, SeriesOption } from '../../core/models/site-config.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CardService } from '../../core/services/cardService';
import { DropdownComponent } from '../../shared/dropdown/dropdown';
import { ToastService } from '../../core/services/toast';
import { firstValueFrom } from 'rxjs';
import { extractShortId } from '../../shared/utils/slug';
import { compressImage } from '../../shared/utils/image';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DropdownComponent],
  templateUrl: './card-form.html'
})
export class CardFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cardService = inject(CardService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  public isEditMode = false;
  public isOpen = false;
  isLoading = false;

  private editId: string | null = null;
  public TradeType = TradeType;
  public Currency = Currency;
  private CardCondition = CardCondition;
  private Franchise = Franchise;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  public conditions = Object.values(CardCondition);
  public franchises = Object.values(Franchise);
  public languages = Object.values(CardLanguage);
  public currencies = Object.values(Currency);
  
  availableRarities: RarityOption[] = [];
  availableSeries: SeriesOption[] = [];
  availableSets: SetOption[] = [];
  rarities: string[] = [];
  seriesNames: string[] = [];
  setNames: string[] = [];

  cardForm = this.fb.group({
    userName: [{ value: '', disabled: true }, [Validators.required]],
    cardName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    franchise: ['', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(9999999)]],
    currency: [Currency.ARS, [Validators.required]],
    condition: ['', [Validators.required]],
    language: ['', [Validators.required]],
    rarity: ['', [Validators.required]],
    seriesName: [''],
    setName: [''],
    cardNumber: [''],
    type: [TradeType.VENDO, [Validators.required]],
    whatsappContact: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(18)
    ]],
    description: ['', [Validators.maxLength(150)]],
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.cardForm.patchValue({ userName: user.displayName });
    }

    // 1. Escuchar cambios en la franquicia o idioma
    this.setupFranchiseAndLanguageListeners();

    // 2. Escuchar cambios en la serie para filtrar sets
    this.setupSeriesListener();

    // 3. Listener para Vendo/Busco
    this.setupTypeListener();

    // 4. Cargar datos si es edición
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.prepareEditMode(slug);
    } else {
      // Valor por defecto para activar el catálogo inicial
      if (!this.cardForm.get('language')?.value) {
        this.cardForm.patchValue({ language: CardLanguage.ES });
      }
    }
  }

  // Nuevo método para manejar el cambio de Franquicia o Idioma
  private setupFranchiseAndLanguageListeners() {
    // Escuchamos ambos campos para actualizar el catálogo de sets disponible
    this.cardForm.get('franchise')?.valueChanges.subscribe(() => this.updateAvailableCatalog());
    this.cardForm.get('language')?.valueChanges.subscribe(() => this.updateAvailableCatalog());
  }

  private updateAvailableCatalog() {
    const franchise = this.cardForm.get('franchise')?.value as Franchise;
    const language = this.cardForm.get('language')?.value as CardLanguage;

    if (franchise) {
      // 1. Rarezas (siempre del mapa internacional por ahora o el común)
      this.rarities = RARITIES_BY_FRANCHISE[franchise]?.map(r => r.label) || [];

      // 2. SERIES (Seleccionamos el mapa según el idioma)
      const catalog = (language === CardLanguage.JP) ? SETS_BY_FRANCHISE_JP : SETS_BY_FRANCHISE;
      this.availableSeries = catalog[franchise] || [];
      this.seriesNames = this.availableSeries.map(s => s.name);

      // Resetear campos dependientes para evitar incoherencias
      this.cardForm.get('rarity')?.setValue('', { emitEvent: false });
      this.cardForm.get('seriesName')?.setValue('', { emitEvent: false });
      this.cardForm.get('setName')?.setValue('', { emitEvent: false });
      this.cardForm.get('cardNumber')?.setValue('', { emitEvent: false });
    } else {
      this.rarities = [];
      this.seriesNames = [];
      this.setNames = [];
    }
  }

  // Nuevo listener para cuando cambia la serie
  private setupSeriesListener() {
    this.cardForm.get('seriesName')?.valueChanges.subscribe((selectedSeriesName) => {
      if (selectedSeriesName) {
        const foundSeries = this.availableSeries.find(s => s.name === selectedSeriesName);
        if (foundSeries) {
          this.availableSets = foundSeries.sets;
          this.setNames = this.availableSets.map(s => `${s.id} - ${s.name}`);
        }
      } else {
        this.setNames = [];
      }
      this.cardForm.get('setName')?.setValue('');
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        this.isLoading = true; // Mostrar spinner mientras comprime
        
        // Comprimir imagen (máx 1200px, 70% calidad)
        // Esto soluciona el problema de fotos de +10MB en el celular
        const compressed = await compressImage(file, 1200, 0.7);
        this.selectedFile = compressed;

        // Crear la previsualización local
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error('Error al procesar la imagen:', error);
        this.toastService.error('Hubo un error al procesar la foto. Intentá con otra.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  // Cuando el usuario cambia la franquicia en el HTML
  onFranchiseChange(event: any) {
    const selectedFranchise = event.target.value as Franchise;
    this.availableRarities = RARITIES_BY_FRANCHISE[selectedFranchise] || [];
    this.availableSeries = SETS_BY_FRANCHISE[selectedFranchise] || [];

    // Limpiamos los valores previos
    this.cardForm.get('rarity')?.setValue('');
    this.cardForm.get('seriesName')?.setValue('');
    this.cardForm.get('setName')?.setValue('');
  }

  private setupTypeListener() {
    this.cardForm.get('type')?.valueChanges.subscribe((type) => {
      const priceControl = this.cardForm.get('price');
      const currencyControl = this.cardForm.get('currency');
      if (type === TradeType.BUSCO) {
        priceControl?.disable({ emitEvent: false });
        priceControl?.reset(null, { emitEvent: false });
        priceControl?.clearValidators();
        currencyControl?.disable({ emitEvent: false });
      } else {
        priceControl?.enable({ emitEvent: false });
        priceControl?.setValidators([Validators.required, Validators.min(1), Validators.max(9999999)]);
        currencyControl?.enable({ emitEvent: false });
      }
      priceControl?.updateValueAndValidity();
      currencyControl?.updateValueAndValidity();
    });
  }

  private async prepareEditMode(slug: string): Promise<void> {
    let postToEdit = this.cardService.allPosts().find(p => p.slug === slug);

    if (!postToEdit) {
      const user = this.authService.currentUser();
      if (!user) {
        this.router.navigate(['/publicar']);
        return;
      }

      const allUserPosts = await firstValueFrom(
        this.cardService.getUserPosts(user.uid)
      );

      // Buscamos por slug, con fallback al shortId para posts viejos sin slug
      postToEdit = allUserPosts.find(p =>
        p.slug === slug || p.id.startsWith(extractShortId(slug))
      );
    }

    if (postToEdit) {
      this.isEditMode = true;
      this.editId = postToEdit.id;
      this.cardForm.patchValue(postToEdit);
      if (postToEdit.type === TradeType.BUSCO) {
        this.cardForm.get('price')?.disable();
        this.cardForm.get('currency')?.disable();
      }
      if (postToEdit.imageUrl) {
        this.imagePreview = postToEdit.imageUrl;
      }
    } else {
      this.router.navigate(['/publicar']);
    }
  }

  async onSubmit() {

    if (this.cardForm.invalid) {
      // Esto hace que todos los mensajes de error aparezcan de golpe
      this.cardForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();

    // Agregamos isLoading para evitar doble clic
    if (this.cardForm.valid && user && !this.isLoading) {
      this.isLoading = true; // Empieza la carga
      const val = this.cardForm.getRawValue();

      const postData: any = {
        cardName: val.cardName,
        franchise: val.franchise,
        price: val.type === TradeType.VENDO ? val.price : null,
        currency: val.type === TradeType.VENDO ? val.currency : null,
        condition: val.condition,
        language: val.language,
        rarity: val.rarity,
        type: val.type,
        whatsappContact: (val.whatsappContact || '').replace(/\D/g, ''),
        description: val.description || '',
        seriesName: val.seriesName || '',
        active: true,
        userId: user.uid,
        userName: user.displayName,
        cardNumber: val.cardNumber || '',
      };

      // Procesar Set (si viene del dropdown con formato 'ID - Nombre')
      if (val.setName && val.setName.includes(' - ')) {
        const parts = val.setName.split(' - ');
        postData.setCode = parts[0];
        postData.setName = parts[1];
      } else {
        postData.setName = val.setName;
      }

      try {
        if (this.selectedFile) {
          const imageData = await this.cardService.uploadImage(this.selectedFile);
          postData.imageUrl = imageData.url;
          postData.imagePath = imageData.path;
        } else if (this.isEditMode) {
          const existing = this.cardService.allPosts().find(p => p.id === this.editId);
          if (existing?.imageUrl) postData.imageUrl = existing.imageUrl;
          if (existing?.imagePath) postData.imagePath = existing.imagePath;
        }

        if (this.isEditMode && this.editId) {
          await this.cardService.updatePost(this.editId, postData);
          this.router.navigate(['/mis-anuncios'], { state: { toast: 'updated' } });
        } else {
          await this.cardService.createPost({ ...postData, createdAt: new Date().toISOString() });
          this.router.navigate(['/mis-anuncios'], { state: { toast: 'created' } });
        }

      } catch (error) {
        this.router.navigate(['/mis-anuncios'], { state: { toast: 'error' } });
        this.toastService.error('Hubo un error al procesar la publicación.'); // ← reemplaza alert
      } finally {
        this.isLoading = false;
      }
    }
  }

  onPriceInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9.]/g, ''); // ← permite el punto

    // Evitar múltiples puntos decimales
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    const parsed = value ? parseFloat(value) : null; // ← parseFloat en lugar de parseInt
    this.cardForm.patchValue({ price: parsed }, { emitEvent: false });
    input.value = value;
  }
}
