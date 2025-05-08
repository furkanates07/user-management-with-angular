import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaskPasswordPipe } from './pipes/mask-password.pipe';

@NgModule({
  imports: [CommonModule, MaskPasswordPipe],
  exports: [MaskPasswordPipe],
})
export class SharedModule {}
