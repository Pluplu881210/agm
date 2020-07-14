import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Marcador } from 'src/app/classes/marcador';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
//import {} from 'googlemaps';
import PlaceResult = google.maps.places.PlaceResult;
import { MapaEditarComponent } from './mapa-editar.component';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MapaComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;
  zoom: number;
  public selectedAddress: PlaceResult;
  public appearance = Appearance;
  marcadores: Marcador[] = [];

  constructor(public _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private titleService: Title) { 
  }

  ngOnInit(): void {

    this.titleService.setTitle('Home | @angular-material-extensions/google-maps-autocomplete');
    if(localStorage.getItem('marcadores')){
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));      
    }
    this.setCurrentPosition();
  }

  setCurrentPosition(){

    if('geolocation' in navigator){

      navigator.geolocation.getCurrentPosition((position)=>{

        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
      });
      
    }
  }

  onAutocompleteSelected(result:PlaceResult){
    console.log('onAutocompleteSelected: ', result);
  }

  onLocationSelected(location: Location){
    console.log('onLocationSelected: ', location);
    this.lat = location.latitude;
    this.lng = location.longitude;
  }

  onGermanAddressMapped($event: GermanAddress){
    console.log('onGermanAddressMapped: ', $event);
  }

  borrarMarc(pos:number){
    this.marcadores.splice(pos, 1);
    this.guardarStorage();
    this._snackBar.open('Marcador eliminado', 'Cerrar',{
      duration: 2000,
    });
  }

  agregarMarcador(e){

    const coords:{lat:number, lng:number} = e.coords;

    const marcador = new Marcador(coords.lat, coords.lng);
    this.marcadores.push(marcador);
    this.guardarStorage();
    this._snackBar.open('Marcador agregado', 'Cerrar', {
      duration: 2000,
    });    
  }

  editarMarc(m: Marcador){

    const dialogRef = this.dialog.open(MapaEditarComponent, {
      width: '250px',
      data: {titulo: m.titulo, descripcion: m.descripcion}
    });    
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);      
      if(result){
        m.titulo = result.titulo;
        m.descripcion = result.descripcion;

        this.guardarStorage();
        this._snackBar.open('Marcador actualizado', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  guardarStorage(){
    localStorage.setItem('marcadores', JSON.stringify(this.marcadores));
  }

}
