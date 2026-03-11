import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardCondition, CardLanguage, Franchise, TradeType, RARITIES_BY_FRANCHISE, RarityOption, Currency } from '../../core/models/site-config.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CardService } from '../../core/services/cardService';
import { DropdownComponent } from '../../shared/dropdown/dropdown';
import { ToastService } from '../../core/services/toast';
import { firstValueFrom } from 'rxjs';
import { extractShortId } from '../../shared/utils/slug';

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
  rarities: string[] = [];

  cardForm = this.fb.group({
    userName: [{ value: '', disabled: true }, [Validators.required]],
    cardName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    franchise: ['', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(9999999)]],
    currency: [Currency.ARS, [Validators.required]],
    condition: ['', [Validators.required]],
    language: ['', [Validators.required]],
    rarity: ['', [Validators.required]],
    type: [TradeType.VENDO, [Validators.required]],
    whatsappContact: ['', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(10),
      Validators.maxLength(15)
    ]],
    description: ['', [Validators.maxLength(150)]],
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.cardForm.patchValue({ userName: user.displayName });
    }

    // 1. Escuchar cambios en la franquicia para actualizar rarezas
    this.setupFranchiseListener();

    // 2. Tu listener existente para Vendo/Busco
    this.setupTypeListener();

    // 3. Cargar datos si es edición
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.prepareEditMode(slug);
    }
  }

  // Nuevo método para manejar el cambio de Franquicia
  private setupFranchiseListener() {
    this.cardForm.get('franchise')?.valueChanges.subscribe((selectedFranchise) => {
      // Usamos una guardia para asegurar que selectedFranchise sea del tipo Franchise
      const franchise = selectedFranchise as Franchise;

      if (franchise && RARITIES_BY_FRANCHISE[franchise]) {
        // 1. Actualizamos la lista de opciones
        this.rarities = RARITIES_BY_FRANCHISE[franchise].map(r => r.label);

        // 2. Verificamos la rareza actual con un fallback de string vacío
        // Usamos || '' para asegurar que currentRarity sea un string y no null/undefined
        const currentRarity = this.cardForm.get('rarity')?.value || '';

        if (!this.rarities.includes(currentRarity)) {
          this.cardForm.get('rarity')?.setValue('');
        }
      } else {
        this.rarities = [];
        this.cardForm.get('rarity')?.setValue('');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear la previsualización local
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Cuando el usuario cambia la franquicia en el HTML
  onFranchiseChange(event: any) {
    const selectedFranchise = event.target.value as Franchise;
    this.availableRarities = RARITIES_BY_FRANCHISE[selectedFranchise] || [];

    // Limpiamos el valor de rareza previo para que el usuario elija uno válido para el nuevo juego
    this.cardForm.get('rarity')?.setValue('');
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

      // 1. Objeto base de la publicación
      const postData: any = {
        cardName: val.cardName,
        franchise: val.franchise,
        price: val.type === TradeType.VENDO ? val.price : null,
        currency: val.type === TradeType.VENDO ? val.currency : null,
        condition: val.condition,
        language: val.language,
        rarity: val.rarity,
        type: val.type,
        whatsappContact: val.whatsappContact,
        description: val.description || '',
        active: true,
        userId: user.uid, // Ya lo dejamos firme acá
        userName: user.displayName,

      };

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
