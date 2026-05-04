# GraphQL Example

## Description
This is just an experimental run through creating a GraphQL React project. It aims to replicate a real production environment by establishing different servers in a Docker Compose setup.

## Current state
A simple react frontend has been implemented with an Apollo client. When the docker compose environment is running, you will be presented with two components an Quote system and a Characters in episode.

The quote system simply allows users to request quotes for different types of insurance. Users can create an account, and start quotes. If a quote is not submited, the system will recall unfinished quotes for the user the next time they log in.

The Characters system connects to the [Rick and Morty API](https://rickandmortyapi.com/). Users can enter an episode number and it will fetch the episode title and characters in the episode.

## Technologies
1. React
2. Express
3. GraphQL
4. Apollo
5. PostgreSQL
6. Prisma

## About 