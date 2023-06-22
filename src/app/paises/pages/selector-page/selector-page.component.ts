import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['',Validators.required],
    frontera: ['', Validators.required]
  })

  //llenar selectores
  regiones : string[]    = [];
  paises   : PaisSmall[] = [];
  fronteras: PaisSmall[] = [];
  //fronteras: string[]    = [];

  //UI
  cargando: boolean = false;

  constructor (private fb: FormBuilder,
    private paisesService: PaisesService){}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;


    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_)=> {
        this.miFormulario.get('pais')?.reset('');
        //this.miFormulario.get('frontera')?.disable();
        this.cargando = true;
      }),
      switchMap(region => this.paisesService.getPaisesPorRegiones(region))
    )
    .subscribe(paises=>{
      console.log(paises);
      this.paises = paises;
      this.cargando = false;
    });

    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(() => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap( codigo=> this.paisesService.getPaisPorCodigo(codigo)),
      switchMap(pais => this.paisesService.getPaisesPorBorders(pais?.borders!))
    )
    .subscribe(paises =>{
      //this.fronteras = pais?.borders || [];
      this.fronteras = paises;
      this.cargando = false;
      console.log(paises);
    })
  }

  guardar(){
    this.miFormulario.value;
    console.log(this.miFormulario.value);  }

}


//cuando cambie la region
   // this.miFormulario.get('region')?.valueChanges
   //.subscribe( region => {
     // console.log(region);
      //this.paisesService.getPaisesPorRegiones(region)
     // .subscribe(paises => {
     //   this.paises = paises;

     // })
    //})
