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
import {sortData,prettyPrintStat} from "./util"; 
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const[country,setCountry]=useState("Worldwide");
  const [countryInfo,setCountryInfo]=useState("");
  const [tableData,setTableData]=useState([]);
  const[mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const[mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);
  const[caseType,setCasesType]=useState("cases");

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
          setMapCountries(data);
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
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
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
     isRed
     active={caseType==="cases"}
            onClick={e=>setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            active={caseType==="recovered"}
            title="Recovered"
            onClick={e=>setCasesType("recovered")}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
          isRed
          active={caseType==="deaths"}
           onClick={e=>setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
     </div>
         <Map 
         casesType={caseType}
         countries={mapCountries}
         center={mapCenter}
         zoom={mapZoom}/>
         </div>
         <Card className="app_right">
         <CardContent>
           <h3>Live cases by country</h3>
           <Table countries={tableData}/>
           <h3 className="app_right_header">Worldwide new {caseType}</h3>
           <LineGraph className="line" casesType={caseType}/>
         </CardContent>
         </Card>
    </div>
  );
}
export default App;
