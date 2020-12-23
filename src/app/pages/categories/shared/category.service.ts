import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Category } from './category.model';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = "api/categories";

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  create(category: Category): Observable<Category> {
    return this.http.post(this.apiPath, category).pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`;

    return this.http.put(url, category).pipe(catchError(this.handleError), map(() => category));
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(catchError(this.handleError), map(() => null));
  }

  // Private Methods

  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));

    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(error: any): Observable<any> {
    console.error("ERRO NA REQUISIÇÃO => ", error);

    return throwError(error);
  }

}
