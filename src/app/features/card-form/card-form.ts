import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Condition, Franchise, TradeType } from '../../core/models/site-config.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CardService } from '../../core/services/cardService';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './card-form.html'
})
export class CardFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cardService = inject(CardService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  public isEditMode = false;
  isLoading = false;
  private editId: string | null = null;
  public TradeType = TradeType;
  private Condition = Condition;
  private Franchise = Franchise;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  public conditions = Object.values(Condition);
  public franchises = Object.values(Franchise);

  cardForm = this.fb.group({
    userName: [{ value: '', disabled: true }, [Validators.required]],
    cardName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    franchise: ['Pokémon', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(1), Validators.max(9999999)]],
    condition: ['Near Mint', [Validators.required]],
    type: [TradeType.VENDO, [Validators.required]],
    whatsappContact: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    description: ['', [Validators.maxLength(150)]]
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      // Usamos user.displayName o user.name según como lo tengas en tu AuthService
      this.cardForm.patchValue({ userName: user.displayName });
    }

    this.setupTypeListener();

    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.prepareEditMode(this.editId);
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

  private prepareEditMode(id: string) {
    // Buscamos en el signal allPosts() que ahora viene de Firebase
    const postToEdit = this.cardService.allPosts().find(p => p.id === id);

    if (postToEdit) {
      this.isEditMode = true;
      this.cardForm.patchValue(postToEdit);
      if (postToEdit.type === TradeType.BUSCO) {
        this.cardForm.get('price')?.disable();
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
        type: val.type,
        whatsappContact: val.whatsappContact,
        description: val.description || '',
        active: true,
        userId: user.uid, // Ya lo dejamos firme acá
        userName: user.displayName,
      };

      try {
        // 2. Lógica de Imagen: Si el usuario seleccionó un archivo, lo subimos
        if (this.selectedFile) {
          const imageData = await this.cardService.uploadImage(this.selectedFile);
          postData.imageUrl = imageData.url;
          postData.imagePath = imageData.path;
        }

        // 3. Guardado en Firestore
        if (this.isEditMode && this.editId) {
          await this.cardService.updatePost(this.editId, postData);
        } else {
          await this.cardService.createPost({
            ...postData,
            createdAt: new Date().toISOString()
          });
        }

        this.router.navigate(['/mis-anuncios']);

      } catch (error) {
        console.error('Error en el proceso:', error);
        alert('Hubo un error al procesar la publicación.');
      } finally {
        this.isLoading = false; // Se libera pase lo que pase
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