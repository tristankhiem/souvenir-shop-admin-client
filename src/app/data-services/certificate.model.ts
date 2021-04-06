export class CertificateModel {
  public id: number;
  public name: string;

  constructor(data?: CertificateModel) {
    const certificate = data == null ? this : data;

    this.id = certificate.id;
    this.name = certificate.name;
  }
}
