import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'WebSocket';
  messages: string[] = [];

  ngOnInit() {
    const socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = (event) => {
      this.messages.push(event.data);
    };
  }
}
