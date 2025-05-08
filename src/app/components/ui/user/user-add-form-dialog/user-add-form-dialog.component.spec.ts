import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddFormDialogComponent } from './user-add-form-dialog.component';

describe('UserAddFormDialogComponent', () => {
  let component: UserAddFormDialogComponent;
  let fixture: ComponentFixture<UserAddFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAddFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
