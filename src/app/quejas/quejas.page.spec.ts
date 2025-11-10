import { ComponentFixture, TestBed } from '@angular/core/testing';
// 1. Importar la clase con el nombre correcto: QuejasPage
import { QuejasPage } from './quejas.page'; 

// 2. Describir la clase con el nombre correcto: QuejasPage
describe('QuejasPage', () => { 
  let component: QuejasPage;
  let fixture: ComponentFixture<QuejasPage>;

  beforeEach(async () => {
    // 3. Configuración para componentes Standalone
    await TestBed.configureTestingModule({
      imports: [QuejasPage] // Importamos directamente el componente standalone
    })
    .compileComponents();
    
    // 4. Crear el componente con el nombre correcto
    fixture = TestBed.createComponent(QuejasPage); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});