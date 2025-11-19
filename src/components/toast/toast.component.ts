import { Component, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { Toaster } from 'react-hot-toast';
import { createRoot, Root } from 'react-dom/client';
import { createElement } from 'react';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: '<div #toastContainer></div>',
})
export class ToastComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private root?: Root;

  ngOnInit() {
    const container = this.elementRef.nativeElement;
    this.root = createRoot(container);
    
    this.root.render(
      createElement(Toaster, {
        position: 'top-right',
        toastOptions: {
          duration: 4000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        },
      })
    );
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}
