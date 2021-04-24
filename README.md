# Souvenir Shop Admin Client

Cài đặt angular: Trên command line chạy lệnh 'npm install -g @angular/cli'
Tại thư mục gốc của project chạy npm install để import các thư viện cần thiết
Chạy lệnh 'ng serve' để chạy project



** Nội dung của các files:
  * app-pages-routing.modules.ts: chứa cấu hình url trên giao diện của hệ thống.
  * commons: chứa các components dùng cho ở nhiều components khác
    * data-table: component tạo data table
    * date-picker: component tạo date picker
    * dropdown-menu: component tạo combobox
    * modal-wrapper: component tạo các modal popup
  * data-services: chứa các con model của hệ thống
    * schema: các model tương ứng với các table trong db
    * search: các model dành cho thao tác search
  * [page].component.ts:
    ! -> [page] là từng folder con trong folder pages, mang ý nghĩa từng trang con tương ứng.
    * constructor:
        root: html hiện tại
        loading: hình cục xoay xoay khi loading
        alert: thông báo ở góc phải trên khi có lỗi hoặc thành công
        modal: popup confirm khi xoá data
        service: lớp service để gọi xuống API (Back end)
