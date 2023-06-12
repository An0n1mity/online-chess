# Online chess project

![Landing Page](landing_screenshot.png)
![Game Page](game_screenshot.png)

# Disclaimer :warning:

It's my first doing a web app project, and god knows that doing a full stack have with 0 knowledges is really hard.
The project is still under development, features can be messed up sometimes, but hey it was built for experimentations
with web technolgies :smile:

## Table of Contents :eyes:

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [License](#license)

## Getting Started

These instructions will guide you on how to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites :whale:

- [Docker](https://www.docker.com/) installed on your machine.

### Installation :computer:

1. Clone the repository:

```shell
git clone https://github.com/An0n1mity/online-chess
```

2. Navigate to the project directory:

```shell
cd online-chess
```

3. Build the Docker containers:

```shell
docker-compose build
```

4. Start the Docker containers:

```shell
docker-compose up
```

5. Access the application in your web browser at [http://localhost:3000](http://localhost:3000).


## Technologies :wrench:

- [Django](https://www.djangoproject.com/) - Web framework for backend development.
- [React](https://reactjs.org/) - JavaScript library for frontend development.
- [Celery](http://www.celeryproject.org/) - Distributed task queue for background processing.
- [Redis](https://redis.io/) - In-memory data structure store used as a message broker.
- [Docker](https://www.docker.com/) - Containerization platform for easy deployment and scalability.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.MD) file for details.

## Stockfish
https://github.com/official-stockfish/Stockfish
