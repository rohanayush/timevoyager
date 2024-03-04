import { Injectable } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { EventsStruc } from './model/events';

@Injectable({
  providedIn: 'root',
})
export class EventDataService {
  
  events = [
    {
      id: 1,
      title: 'The Renaissance Begins',
      date: '14th Century',
      description:
        'The Renaissance period marks the revival of art, culture, and learning in Europe, leading to significant advancements in science, art, and philosophy.',
      image: 'assets/renaissance.png',
      video: 'https://youtu.be/UsKSB-aT3ys?si=nwm1CmndCDtggrts',
    },
    {
      id: 2,
      title: 'Declaration of Independence',
      date: '1776',
      description:
        'The Declaration of Independence was adopted by the Continental Congress, declaring the 13 American colonies independent from British rule and laying the foundation for the United States.',
      image: 'assets/Independence.png',
      video: 'https://youtu.be/yb7MI8NQLoo?si=ZiGepv3q5qhq4QV5',
    },
    {
      id: 3,
      title: 'Fall of the Berlin Wall',
      date: '1989',
      description:
        'The fall of the Berlin Wall symbolized the end of the Cold War and the reunification of East and West Germany, marking a significant moment in modern history.',
      image: 'assets/berlin.png',
      video: 'https://youtu.be/A9fQPzZ1-hg?si=s9NHdTSoU1qgFof0',
    },
    {
      id: 4,
      title: 'The Black Death',
      date: '14th Century',
      description:
        'The bubonic plague, known as the Black Death, swept through Europe, Asia, and Africa, causing immense suffering and death. It significantly altered demographics, economies, and social structures.',
      image: 'assets/black-death.png',
      video: 'https://youtu.be/HYNB4sAxemk?si=zS4Jwv8zKqcsUoBk',
    },
    {
      id: 5,
      title: 'The Industrial Revolution',
      date: '18th to 19th Centuries',
      description:
        'The Industrial Revolution marked a transition from agrarian economies to industrialized ones. Innovations in machinery, factories, and transportation revolutionized production, urbanization, and labor.',
      image: 'assets/industrial_revolution.png',
      video: 'https://youtu.be/zjK7PWmRRyg?si=1Qyk6pkn-tswvSDA',
    },
    {
      id: 6,
      title: 'The Moon Landing',
      date: '1969',
      description:
        "Apollo 11's successful moon landing was a monumental achievement in human history. Neil Armstrong's iconic words, \"That's one small step for [a] man, one giant leap for mankind,\" symbolized scientific progress, exploration, and international cooperation.",
      image: 'assets/moon_landing.png',
      video: 'https://youtu.be/cwZb2mqId0A?si=NR2CdRhZJAz7DiIW',
    },
    
    {
      id: 7,
      title: 'The Renaissance',
      date: '14th to 17th Centuries',
      description:
        'The Renaissance period witnessed a revival of art, culture, and learning in Europe. It led to significant advancements in science, art, and philosophy. Renowned figures like Leonardo da Vinci, Michelangelo, and Galileo Galilei emerged during this transformative era.',
      image: 'assets/renaissance.png',
      video: 'https://youtu.be/UsKSB-aT3ys?si=nwm1CmndCDtggrts',
    },
    {
      id: 8,
      title: 'The Atomic Bomb',
      date: '1945',
      description:
        'The dropping of atomic bombs on Hiroshima and Nagasaki during World War II changed the course of history. It highlighted the destructive power of nuclear weapons and influenced global politics, arms race dynamics, and the Cold War.',
      image: 'assets/atomic_bomb.png',
      video: 'https://youtu.be/w4q1fG1vh5I?si=dXEBRGUvMPYxxick',
    },
    {
      id: 9,
      title: 'The Internet Revolution',
      date: 'Late 20th Century',
      description:
        'The advent of the internet transformed communication, commerce, education, and social interactions. It connected the world, democratized information, and paved the way for the digital age we live in today.',
      image: 'assets/internet_revolution.png',
      video: 'https://youtu.be/TvSvGb_UPUk?si=VJIUx7uCP3msoSy0',
    },
  ];

  constructor() {
    
  }

  getEvents() {
    return of(this.events);
  }

  getAllDate(): Observable<string[]> {
    return of(this.events).pipe(
      map((eventsArr) => eventsArr.map((event) => event.date))
    );
  }

  getEventById(id: number): Observable<EventsStruc | undefined> {
    const event = this.events.find((e) => e.id === id);
    return of(event);
  }

  searchEvents(query: string): Observable<any[]> {
    // If query is empty, return all events
    if (!query.trim()) {
      return of(this.events);
    }

    // Filter events based on query
    const searchedEvents = this.events.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.date.toLowerCase().includes(query.toLowerCase()) 
    );

    // If no events match the query, return "none"
    if (searchedEvents.length === 0) {
      return of(['none']);
    }

    return of(searchedEvents);
  }
}
