# Souvenir Shop Admin Client

Cài đặt angular: Trên command line chạy lệnh 'npm install -g @angular/cli'
Tại thư mục gốc của project chạy npm install để import các thư viện cần thiết
Chạy lệnh 'ng serve' để chạy project



** Nội dung của các files:
  * app-pages-routing.modules.ts: chứa cấu hình url trên giao diện của hệ thống.
  * [page].component.ts:
    ! -> [page] là từng folder con trong folder pages, mang ý nghĩa từng trang con tương ứng.
    * constructor:
        root: html hiện tại
        loading: hình cục xoay xoay khi loading
        alert: thông báo ở góc phải trên khi có lỗi hoặc thành công
        modal: popup confirm khi xoá data
        service: lớp service để gọi xuống API (Back end)
