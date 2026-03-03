import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardCondition, CardLanguage, CardRarity, Franchise, TradeType } from '../../core/models/site-config.model';
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
  private CardCondition = CardCondition;
  private Franchise = Franchise;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  public conditions = Object.values(CardCondition);
  public franchises = Object.values(Franchise);
  public languages = Object.values(CardLanguage);
  public rarities = Object.values(CardRarity);

  cardForm = this.fb.group({
    userName: [{ value: '', disabled: true }, [Validators.required]],
    cardName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    franchise: [Franchise.POKEMON, [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(1), Validators.max(9999999)]],
    condition: [CardCondition.MINT, [Validators.required]],
    language: [CardLanguage.ES, [Validators.required]],
    rarity: [CardRarity.COMMON, [Validators.required]],
    type: [TradeType.VENDO, [Validators.required]],
    whatsappContact: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.minLength(10), Validators.maxLength(10)]],
    description: ['', [Validators.maxLength(150)]],

  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.cardForm.patchValue({ userName: user.displayName });
    }

    this.setupTypeListener();

    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.prepareEditMode(slug);
    }
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

  private setupTypeListener() {
    this.cardForm.get('type')?.valueChanges.subscribe((type) => {
      const priceControl = this.cardForm.get('price');
      if (type === TradeType.BUSCO) {
        priceControl?.disable({ emitEvent: false });
        priceControl?.reset(null, { emitEvent: false });
        priceControl?.clearValidators();
      } else {
        priceControl?.enable({ emitEvent: false });
        priceControl?.setValidators([Validators.required, Validators.min(1), Validators.max(9999999)]);
      }
      priceControl?.updateValueAndValidity();
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
      }
      if (postToEdit.imageUrl) {
        this.imagePreview = postToEdit.imageUrl;
      }
    } else {
      this.router.navigate(['/publicar']);
    }
  }

  async onSubmit() {
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
    let value = input.value.replace(/[^0-9]/g, '');
    this.cardForm.patchValue({ price: value ? parseInt(value, 10) : null }, { emitEvent: false });
    input.value = value;
  }
}