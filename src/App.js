import React ,{useState,useEffect} from 'react';
import './App.css';
import LineGraph from "./components/LineGraph";
import {
  MenuItem,
  FormControl,
  Select, Card, CardContent
} from "@material-ui/core";
import InfoBox  from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import {sortData} from "./util"; 

function App() {
  const [countries, setCountries] = useState([]);
  const[country,setCountry]=useState("worldwide");
  const [countryInfo,setCountryInfo]=useState("");
  const [tableData,setTableData]=useState([]);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all").then(response=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    });
  },[]);

  useEffect(() => {
    const getCountriesData = async () => {
     await  fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData=sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
      };
      
    getCountriesData();
  }, []);

  const onCountryChange=async(event)=>{
    const countryCode=event.target.value; 
    setCountry(countryCode);  
    const url = countryCode==="worldwide"?'http://disease.sh/v3/covid-19/all'
    :`http://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url).then(response=>response.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
    });
  };

  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
      <h1>Covid-19 Tracker</h1>
      <FormControl className="app_dropdown">
        <Select variant="outlined" value={country} onChange={onCountryChange}>
          <MenuItem value="Worldwide">Worldwide</MenuItem>
         {
           countries.map((country)=>(
             <MenuItem value={country.value}>{country.name}</MenuItem>
           ))
         }

        </Select>
      </FormControl>

     </div>
     <div className="app_stats">
     <InfoBox
            
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
          
            title="Recovered"
          
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
           
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
     </div>
         <Map/>
         </div>
         <Card className="app_right">
         <CardContent>
           <h3>Live cases by country</h3>
           <Table countries={tableData}/>
           <h3>World wide new cases</h3>
           <LineGraph  casesType="cases"/>
         </CardContent>
         </Card>
    </div>
  );
}
export default App;
