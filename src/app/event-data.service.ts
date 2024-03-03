import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of } from 'rxjs';
import { EventsStruc } from './model/events';

@Injectable({
  providedIn: 'root',
})
export class EventDataService {
  // events = [
  //   {
  //     id: 1,
  //     title: 'The Renaissance Begins',
  //     date: '14th Century',
  //     description:
  //       'The Renaissance period marks the revival of art, culture, and learning in Europe, leading to significant advancements in science, art, and philosophy.',
  //     image: 'renaissance.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 2,
  //     title: 'Declaration of Independence',
  //     date: '1776',
  //     description:
  //       'The Declaration of Independence was adopted by the Continental Congress, declaring the 13 American colonies independent from British rule and laying the foundation for the United States.',
  //     image: 'declaration_of_independence.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 3,
  //     title: 'Fall of the Berlin Wall',
  //     date: '1989',
  //     description:
  //       'The fall of the Berlin Wall symbolized the end of the Cold War and the reunification of East and West Germany, marking a significant moment in modern history.',
  //     image: 'berlin_wall.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 1,
  //     title: 'The Renaissance Begins',
  //     date: '14th Century',
  //     description:
  //       'The Renaissance period marks the revival of art, culture, and learning in Europe, leading to significant advancements in science, art, and philosophy.',
  //     image: 'renaissance.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 2,
  //     title: 'Declaration of Independence',
  //     date: '1776',
  //     description:
  //       'The Declaration of Independence was adopted by the Continental Congress, declaring the 13 American colonies independent from British rule and laying the foundation for the United States.',
  //     image: 'declaration_of_independence.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 3,
  //     title: 'Fall of the Berlin Wall',
  //     date: '1989',
  //     description:
  //       'The fall of the Berlin Wall symbolized the end of the Cold War and the reunification of East and West Germany, marking a significant moment in modern history.',
  //     image: 'berlin_wall.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 1,
  //     title: 'The Renaissance Begins',
  //     date: '14th Century',
  //     description:
  //       'The Renaissance period marks the revival of art, culture, and learning in Europe, leading to significant advancements in science, art, and philosophy.',
  //     image: 'renaissance.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 2,
  //     title: 'Declaration of Independence',
  //     date: '1776',
  //     description:
  //       'The Declaration of Independence was adopted by the Continental Congress, declaring the 13 American colonies independent from British rule and laying the foundation for the United States.',
  //     image: 'declaration_of_independence.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
  //   {
  //     id: 3,
  //     title: 'Fall of the Berlin Wall',
  //     date: '1989',
  //     description:
  //       'The fall of the Berlin Wall symbolized the end of the Cold War and the reunification of East and West Germany, marking a significant moment in modern history.',
  //     image: 'berlin_wall.jpg',
  //     video: 'https://www.youtube.com/watch?v=1',
  //   },
   
    
   
   
  // ];
  events=[
    {
        "id": 1,
        "title": "Slave Trade",
        "date": "16th to 19th Centuries",
        "description": "The slave trade involved the movement of millions of Africans to the New World, resulting in deep social divides and economic exploitation. Its consequences still resonate in many societies today.",
        "image": "renaissance.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 2,
        "title": "The First World War",
        "date": "1914 to 1918",
        "description": "World War I involved over 100 countries and resulted in approximately 9 million soldier deaths and 5 million civilian deaths. It introduced military technologies like machine guns, tanks, and chemical weapons.",
        "image": "declaration_of_independence.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 3,
        "title": "Introduction of Electricity",
        "date": "19th Century",
        "description": "Electricity transformed everyday life, revolutionizing communication, transportation, and industry. Its widespread adoption had a profound impact on society, culture, and technology.",
        "image": "berlin_wall.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 4,
        "title": "The Black Death",
        "date": "14th Century",
        "description": "The bubonic plague, known as the Black Death, swept through Europe, Asia, and Africa, causing immense suffering and death. It significantly altered demographics, economies, and social structures.",
        "image": "black_death.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 5,
        "title": "The Industrial Revolution",
        "date": "18th to 19th Centuries",
        "description": "The Industrial Revolution marked a transition from agrarian economies to industrialized ones. Innovations in machinery, factories, and transportation revolutionized production, urbanization, and labor.",
        "image": "industrial_revolution.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 6,
        "title": "The Moon Landing",
        "date": "1969",
        "description": "Apollo 11's successful moon landing was a monumental achievement in human history. Neil Armstrong's iconic words, \"That's one small step for [a] man, one giant leap for mankind,\" symbolized scientific progress, exploration, and international cooperation.",
        "image": "moon_landing.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 7,
        "title": "The Fall of the Berlin Wall",
        "date": "1989",
        "description": "The fall of the Berlin Wall symbolized the end of the Cold War and the reunification of East and West Germany. It marked a significant moment in modern history, emphasizing freedom, unity, and geopolitical shifts.",
        "image": "berlin_wall.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 8,
        "title": "The Renaissance",
        "date": "14th to 17th Centuries",
        "description": "The Renaissance period witnessed a revival of art, culture, and learning in Europe. It led to significant advancements in science, art, and philosophy. Renowned figures like Leonardo da Vinci, Michelangelo, and Galileo Galilei emerged during this transformative era.",
        "image": "renaissance.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 9,
        "title": "The Atomic Bomb",
        "date": "1945",
        "description": "The dropping of atomic bombs on Hiroshima and Nagasaki during World War II changed the course of history. It highlighted the destructive power of nuclear weapons and influenced global politics, arms race dynamics, and the Cold War.",
        "image": "atomic_bomb.jpg",
        "video": "https://www.youtube.com/watch?v=1"
    },
    {
        "id": 10,
        "title": "The Internet Revolution",
        "date": "Late 20th Century",
        "description": "The advent of the internet transformed communication, commerce, education, and social interactions. It connected the world, democratized information, and paved the way for the digital age we live in today.",
        "image": "internet_revolution.jpg",
        "video": "https://www.youtube.com/watch?v="
    }
  ]
  private storageSubject = new Subject<any>();

  constructor() {
    window.addEventListener('storage', () => {
      this.storageSubject.next(localStorage);
    });
  }

  watchLocalStorage(): Observable<any> {
    return this.storageSubject.asObservable();
  }

  getEvents() {
    return of(this.events);
  }

  getAllDate(): Observable<string[]> {
    return of(this.events).pipe(
      map(eventsArr => eventsArr.map(event => event.date))
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
    const searchedEvents = this.events.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    );

    // If no events match the query, return "none"
    if (searchedEvents.length === 0) {
      return of(['none']);
    }

    // Return filtered events
    return of(searchedEvents);
  }
}
