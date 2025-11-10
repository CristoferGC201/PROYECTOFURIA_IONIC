import { ComponentFixture, TestBed } from '@angular/core/testing';
// Importamos la nueva clase, que ahora es ChatPage
import { ChatPage } from './chat.page'; 

// Describimos la nueva clase ChatPage
describe('ChatPage', () => { 
  let component: ChatPage; // Usamos el tipo ChatPage
  let fixture: ComponentFixture<ChatPage>; // Usamos el tipo ChatPage

  beforeEach(async () => {
    // Si tu página es Standalone, debes usar imports aquí si usa módulos de Ionic/Angular que no son "roots"
    await TestBed.configureTestingModule({
      imports: [ChatPage] // Importamos directamente el componente Standalone
    }).compileComponents();
    
    fixture = TestBed.createComponent(ChatPage); // Creamos el componente ChatPage
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});