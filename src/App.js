import { useState, useEffect } from 'react';
import './css/App.css';

function App() {
  const [pokemon , setPokemon] = useState([]);
  const [getPokemon , setGetPokemon] = useState([]);
  const [gettype, setGetType] = useState([]);
  const [offset, setOffset] = useState(0);
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const searchName = async (e) => {
    const search = e.target.value.toLowerCase();
    const regex = /^[a-zA-Z0-9 ]*$/;
    setName(search.trim());
    if (search.trim() === '' || !regex.test(name)) {
      return; 
    }
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.trim().toLowerCase()}`);
        const data = await response.json();
        setGetPokemon([data]);
      } catch (error) {
        setName('');
      }
  };
    

  const searchType = async (e) => {
    setType(e.target.value);
  };

  const selectType = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/type`)
    .then((response) => response.json());
    setGetType(response.results);
  };  
  
  
  const selectApiData = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
    .then((response) => response.json());
    setPokemon([...pokemon, ...response.results]);
    setOffset(offset + 20);
  };  
  
  useEffect(() => {
    selectApiData();
    selectType();
  },[]);
       
 
  const getApiData = async () => {
    const response = await Promise.all(pokemon.map(async pokemon => {
      return fetch(pokemon.url).then((response) => response.json());
    }))
      setGetPokemon(response);

  };   

  useEffect(() => { 
    if(name === ''){
      getApiData();
    }
  },[pokemon ,name]);



  const card_pokemon = getPokemon.map( data => {
    if (type!=='') {
      let is_true = 0;
      data.types.map( type_list => {
        if (type_list.type.name === type) {
          is_true = 1;
        }
      })
      if (is_true === 1) {
        return (
          <div className={`card_pokemon ${data.types[0].type.name}`}>
            <div className='name'>{data.name}</div>
            <img src={data.sprites.front_default} alt="pokemon" />
            <div className='types'>
              {
                data.types.map( type => (
                  <div className={`type __${type.type.name}`}>{type.type.name}</div>
                ))
              }
            </div>
          </div>
        )
      }
    }else{
      return (
        <div className={`card_pokemon ${data.types[0].type.name}`}>
           <div className='name'>{data.name}</div>
           <img src={data.sprites.front_default} alt="pokemon" />
           <div className='types'>
             {
               data.types.map( type => (
                 <div className={`type __${type.type.name}`}>{type.type.name}</div>
               ))
             }
           </div>
         </div>
      )
    } 
  });

  return (
    <div className="App">
      <div className="main_pokemon">
      <h2 className="title">POKEMON</h2>
        <div className='search_pokemon'>
          <input type="text" placeholder="Find Pokemon"  onChange={searchName}  pattern="[a-zA-Z0-9\s]*"  />
          <select name="type" id="type" onChange={searchType}>
            <option value="">All Type</option>
            {
              gettype.map( type => (
                <option value={type.name}>{type.name}</option>
              ))
            }
          </select>         
        </div>
        <div className='list_pokemon'>
        {card_pokemon}
        </div>
           {  
            (type === '' && name === '') && (
            <div className='load_more'>
              <button onClick={selectApiData}>Load More</button>
            </div>
           )}
      </div>
    </div>
  );
}

export default App;
