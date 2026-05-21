import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { CHARACTERS_IN_EPISODE, type Character } from "~/graphql/rickandmorty";
import { ClipLoader } from 'react-spinners';

export default function RickMortyContent() {
  const [episode, setEpisode] = useState(null);
  const [episodeTitle, setEpisodeTitle] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { loading, error, data } = useQuery(CHARACTERS_IN_EPISODE, {
    variables: { id: episode },
    skip: !episode,
  })

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => { console.log('adding extra time to see loading')}, 5000);
    if (data) {
      const { name, characters } = data.episode;
      console.log(data, name, characters);
      setEpisodeTitle(name);
      setCharacters(characters);
    }

    setIsLoading(false);
    clearInterval(timer);
  }, [data]);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const value: number = parseInt(evt.currentTarget.value);
    if (isNaN(value)) {
      alert("enter a valid number");
      return;
    }

    setEpisode(Number(value));
  }

  const handleSubmit = (evt: React.SubmitEvent) => {
    evt.preventDefault();
  }

  return <>
    <div>
      <h2>Rick and Morty GraphQL API</h2>
      <p><a href="https://rickandmortyapi.com/" target="blank" className="function-link">Rick and Morty API</a></p>
      <div>
        <form id="episode-form" onSubmit={handleSubmit}>
          <label htmlFor="epi_num">Enter an episode number:</label>&nbsp;&nbsp;
          <input type="number" name="epi_num" onChange={handleChange} style={{border: "1px solid"}} size={3} placeholder="3"/>
        </form>
      </div>
      <hr />
      {loading &&
          <ClipLoader
          color="green"
          loading={isLoading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      }
      {
        !loading && episodeTitle &&
        <div>
          Characters in episode <span className="data-highlight">{episode}</span> - [Title: <span className="data-highlight">{episodeTitle}</span>]
          <hr />
          <div className="character-list">
            <ol>
              {
                characters.map((character: Character, idx: number) => (
                  <li key={idx}>{character.name}</li>
                ))
              }
            </ol>
          </div>
        </div>
      }
    </div>
  </>
}
