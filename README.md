# Task Management Web Application

Ova aplikacija je razvijena kao deo seminarskog rada na Fakultetu organizacionih nauka, sa ciljem prikazivanja kompletne realizacije jednog softverskog sistema za upravljanje zadacima, koristeći modernu tehnologiju.

## Opis

Aplikacija omogućava korisnicima upravljanje zadacima kroz:
- Vizuelni prikaz putem Kanban table,
- Kalendar sa zadacima i praznicima,
- Administratorski panel za upravljanje korisnicima i statistikom.

Podržane funkcionalnosti uključuju:
- Registraciju, prijavu i odjavu korisnika,
- Kreiranje, izmenu, brisanje i pretragu zadataka,
- Upload fajlova uz zadatke,
- Promenu statusa zadatka (drag-and-drop),
- Prikaz zadataka po danima u kalendaru,
- Administratorski prikaz statistike i menadžment korisnika.

## Tehnologije

**Frontend:**
- React
- JavaScript (JSX)
- React Router

**Backend:**
- PHP
- Laravel Framework
- MySQL baza podataka
- RESTful API

## Struktura Projekta

- **Frontend (React)**: Prikaz korisničkog interfejsa, validacija, komunikacija sa API-jem
- **Backend (Laravel)**: API logika, autentifikacija (JWT), validacija, rad sa bazom
- **Baza podataka**: Struktura bazirana na modelima `User`, `Task`, `Category`, `Notification`, `TaskFile`, itd.

## Pokretanje aplikacije

### Backend:
1. Klonirati repozitorijum.
2. Pokrenuti `composer install`.
3. Napraviti `.env` fajl i podesiti konekciju ka MySQL bazi.
4. Pokrenuti migracije: `php artisan migrate`
5. Pokrenuti server: `php artisan serve`

### Frontend:
1. Ući u frontend direktorijum.
2. Pokrenuti `npm install`.
3. Pokrenuti aplikaciju: `npm start`
