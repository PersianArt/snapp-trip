import { useEffect, useState } from 'react';
import './App.css';
import { useRequest } from './useRequest';

export type PostType = {
  id: number;
  body: string;
  title: string;
  userId: number;
};

function App() {
  const [number, setNumber] = useState(1);
  const { data, isLoading, error, fetchData, refetchData } = useRequest<PostType>({
    url: `https://jsonplaceholder.typicode.com/posts/${number}`,
  });

  useEffect(() => {
    fetchData();
  }, [number]);

  if (error) {
    <p>{error.message}</p>;
  }

  return (
    <div className="app">
      <div className="wrapper">
        <button onClick={() => refetchData()}>refetch</button>
        <input value={number} onChange={(e) => setNumber(+e.target.value)} />
        {isLoading ? 'Loading...' : <div>post: {data?.id ?? ''}</div>}
      </div>

      {error && (
        <div className="wrapper">
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
