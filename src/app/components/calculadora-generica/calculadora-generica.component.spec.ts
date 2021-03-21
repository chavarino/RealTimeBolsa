import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalculadoraGenericaComponent } from './calculadora-generica.component';

describe('CalculadoraGenericaComponent', () => {
  let component: CalculadoraGenericaComponent;
  let fixture: ComponentFixture<CalculadoraGenericaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculadoraGenericaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculadoraGenericaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
