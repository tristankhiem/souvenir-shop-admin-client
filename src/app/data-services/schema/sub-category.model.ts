import {CategoryModel} from './category.model';

export class SubCategoryModel {
  public id: number;
  public name: string;
  public category: CategoryModel;

  public constructor(
    data?: SubCategoryModel
  ) {
    const subCategory = data == null ? this : data;

    this.id = subCategory.id;
    this.name = subCategory.name;
    this.category = new CategoryModel(subCategory.category);
  }
}
