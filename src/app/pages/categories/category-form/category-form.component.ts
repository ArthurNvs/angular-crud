import { AfterContentChecked, Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import * as toastr from 'toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string = "";
  categoryForm!: FormGroup;
  pageTitle: string = "";
  serverErrorMessages!: string[];
  submittingForm: boolean = false;
  category: Category = new Category(0);

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }


  ngAfterContentChecked() {
    this.setPageTitle();
  }


  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();
  }

  // Private Methods

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new")
      this.currentAction = "new";
    else
      this.currentAction = "edit";
  }


  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }


  private loadCategory() {
    if (this.currentAction == "edit") {

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById((+params.get('id')))))
        .subscribe((category) => {
          this.category = category;
          this.categoryForm.patchValue(category)
        },
          (error) => alert('Ocorreu um erro no servidor. Tente novamente mais tarde.')
        )
    }
  }


  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = "Cadastrar Nova Categoria"
    else {
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(0), this.categoryForm.value);

    this.categoryService.create(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(0), this.categoryForm.value);

    this.categoryService.update(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    );

  }

  private actionsForSuccess(category: Category) {
    toastr.success("Solicitação processada com sucesso!");

    // redirect and reload component page
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error: HttpErrorResponse) {
    toastr.error("Erro ao processar solicitação!");

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error.message).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor! Tente novamente mais tarde."];
  }
}