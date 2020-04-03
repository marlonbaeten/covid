import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';

const App = () => {
  const [data, setData] = useState([]);
  const [filtering, setFiltering] = useState({});

  useEffect(() => {
    axios.get('/api', {
      params: filtering,
    }).then((response) => {
      setData(response.data.countries);
    });
  }, [filtering]);

  const updateFilter = (e) => {
    setFiltering({
      ...filtering,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <h1 className="my-4">Covid monitor</h1>
      <div className="card">
        <div className="card-body">
          <form className="form-inline py-2">
            <div className="form-group">
              <label htmlFor="sort">Sort</label>
              <select
                className="form-control mx-2"
                id="sort"
                name="sort"
                onChange={(e) => updateFilter(e)}
              >
                <option value="">-</option>
                <option value="country">Country</option>
                <option value="cases">Cases</option>
                <option value="deaths">Deaths</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="filter">Filter</label>
              <select
                className="form-control mx-2"
                id="filter"
                name="filter"
                onChange={(e) => updateFilter(e)}
              >
                <option value="">-</option>
                <option value="100k_cases">100K cases</option>
                <option value="europe">Europe only</option>
                <option value="1k_deaths">1K deaths</option>
              </select>
            </div>
          </form>
          <table className="table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Cases</th>
              <th>Per million</th>
              <th>Today</th>
              <th>Deaths</th>
              <th>Per million</th>
              <th>Today</th>
            </tr>
            </thead>
            <tbody>
            {data.map((country) => (
              <tr key={country.country}>
                <td>{country.country}</td>
                <td>{country.cases}</td>
                <td>{country.casesPerOneMillion}</td>
                <td>{country.todayCases}</td>
                <td>{country.deaths}</td>
                <td>{country.deathsPerOneMillion}</td>
                <td>{country.todayDeaths}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
