import {Injectable} from '@angular/core';

declare var $: any;

@Injectable()
export class AppLoading {
  private TEMPLATE = `<div style="z-index: 9999; background: rgba(90,90,90,.6);" data-app-loading class="overlay d-flex justify-content-center align-items-center color-white">
                        <i class="fas fa-2x fa-sync fa-spin"></i>
                      </div>`;
  show(contentSelector: any = 'html'): void {
    if (contentSelector === undefined || contentSelector == null || contentSelector === '') {
      contentSelector = 'html';
    }

    $(contentSelector).addClass('overlay-wrapper');
    $(contentSelector).append(this.TEMPLATE);
  }

  hide(contentSelector: any = 'html'): void {
    if (contentSelector === undefined || contentSelector == null || contentSelector === '') {
      contentSelector = 'html';
    }
    $(contentSelector).find('[data-app-loading]').remove();
    $(contentSelector).removeClass('overlay-wrapper');
  }

  hideAll(): void {
    $(document).find('[data-app-loading]').remove();
    $(document).removeClass('overlay-wrapper');
  }
}
