import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity,  ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import * as Crypto from 'expo-crypto';
import Counter from "react-native-counters";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import wifi from './assets/Wifi_image.jpeg'
import services_img from './assets/services.jpeg'
import dining_img from './assets/Dining.jpeg'
import upgrade_img from './assets/upgrade.jpeg'

import laundry_img from './assets/Laundry.jpeg'



import CounterInput from "react-native-counter-input";

import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {

 
  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Hotel" component={HomeScreen} />
      <Stack.Screen name="AboutUs" component={Hotel_details} />

       <Stack.Screen name="Services" component={Hotel_Services}/>
       <Stack.Screen name="upgrade" component={Upgrade_Room}/> 

      <Stack.Screen name="Dining" component={Dining_menu}/> 
      <Stack.Screen name="Wifi" component={Wifi_Details}/> 
      <Stack.Screen name="Laundry" component={Laundry_rates}/> 
      <Stack.Screen name="Checkout" component={Checkout_bill}/> 


    </Stack.Navigator>
  </NavigationContainer>

  );

}

function HomeScreen(props) {

  const image = { uri: "https://reactjs.org/logo-og.png" };

  const [hotelname, sethotelname] = useState(null);
  const [code, setcode] = useState(null);
  const [addr, setaddr] = useState(null);

  const [img_str, setimg_str] = useState(null);
  const [img_gen, setimg_gen] = useState(null);

  

  const [path, setpath] = useState(null);
  const [genpath, setgenpath] = useState(null);
  // const [restrpath, setrestrpath] = useState(null);


  const [phone, setphone] = useState(null);
  const [email, setemail] = useState(null);
  const [desc, setdesc] = useState(null);
  const [long, setlong] = useState(null);
  const [lat, setlat] = useState(null);
  const [room, setroom] = useState([]);




  let uri = "http://photos.hotelbeds.com/giata/original/"

  

      const getName = async() => {


      const ApiKey = ""
      const secretkey = ""

      var timeInSeconds = Math.floor((new Date()).getTime() / 1000);
      var sigString = ApiKey + secretkey + timeInSeconds
      console.log(sigString)
    

      const XSignature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        sigString,
      );
      console.log('XSignature: ', XSignature);

      var url = "https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels/5/details"
      console.log(url)

      const response = await fetch(url, {
        method: 'GET',
        mode :'no-cors',
        headers: {
        'Api-Key' : ApiKey,
        'X-Signature' : XSignature,
        'Content-Type' :  'application/json',
      }})

      console.log(response)

   
      const result = await response.json();
      sethotelname(result.hotel.name.content) 
      setcode(result.hotel.postalCode) 
      setaddr(result.hotel.address.content) 
      for(let i =4; i<7;i++){
        setroom(result.hotel.facilities[i].description) 
        console.log(room)


      }
      console.log(room)

      setpath(result.hotel.images[5].path) 
      setgenpath(result.hotel.images[9].path) 

      setphone(result.hotel.phones[0].phoneNumber) 
      setemail(result.hotel.email) 
      setdesc(result.hotel.description.content) 
      setlong(result.hotel.coordinates.longitude) 
      setlat(result.hotel.coordinates.latitude) 

      
      var imguri = uri + path
      var gen_imguri = uri + genpath

      console.log(imguri)
      setimg_str(imguri)
      setimg_gen(gen_imguri)


      imguri = ""
      gen_imguri = ""
      restr_imguri = ""


      setpath(null)
      setgenpath(null)

    }


  useEffect(() => { 
      getName();
  },[])

  return (
    
    
  <View style={styles.container}>

     <ImageBackground source={{uri:img_gen}} resizeMode="cover" style={styles.image}>
     <Text style={styles.text}>Inside</Text> 
    </ImageBackground>  


    <View style={styles.header}>
    {/* {getName()} */}
    <Text style = {{color: 'black'}, {fontSize: 20 }}>Globetrotter</Text>
    
  </View>
  <View style={styles.Main}>

   
     <TouchableOpacity   
        onPress={()=>getName()}
        

        >
    <Text style={{fontSize: 20 }}>  Welcome to the hotel </Text>
    <Text style={{fontSize: 30 , marginBottom:15, marginTop : 20}} >{hotelname}</Text>   
   
    </TouchableOpacity>

    <TouchableOpacity 
    onPress={()=>props.navigation.navigate("AboutUs",
    {"name": hotelname, "address":addr, "desc": desc, "email": email, "phone":phone, "code":code,"long":long , "lat":lat, "image":img_str })} >
    <Text style={{fontSize: 20 , marginTop : 20}}>About Us </Text>

    </TouchableOpacity>

  </View>
  <View style={styles.bottom}>
  <TouchableOpacity   
      onPress={()=>props.navigation.navigate("Services")} 
        >
     <Text style={{fontSize: 20 }}>  View Room services</Text>
    <Text>  Room number : 409 </Text>
    </TouchableOpacity>

  </View> 

 

  </View>

  );
}


function Hotel_details(props) {

  return (
    <View style={styles.container}>
         <ImageBackground source={{uri: props.route.params.image}} resizeMode="cover" style={styles.image}>
     <Text style={styles.text}>Inside</Text> 
    </ImageBackground>  

      <View>
        <MapView
 
    style = {styles.map}
      initialRegion={{
        latitude: props.route.params.lat,
        longitude: props.route.params.long,
        latitudeDelta:0.01,
        longitudeDelta: 0.01
      }}>
        <Marker
        coordinate = {{latitude: props.route.params.lat,longitude:props.route.params.long}}
        title={props.route.params.name}
        description= "Your location"
        pinColor="red">
   
        </Marker>
       </MapView>
       </View>

    <View style={styles.body}>
    <Text style={{ marginTop : 40}} > {props.route.params.desc}</Text>
    </View>

    <Text style={{ marginTop : 30}}>  Address : {props.route.params.address} , {props.route.params.code} </Text>
    <Text>  Email:  {props.route.params.email},  Phone : {props.route.params.phone}</Text>
    <Text> </Text>


    </View>



  );
}

function Hotel_Services(props) {



  return (
  <View style={styles.container}>
      <ImageBackground source={services_img} resizeMode="cover" style={{height:840, width:440, flex : 1}}>
    </ImageBackground>  
   
   <View style={styles.services}>
    <TouchableOpacity   
      onPress={()=>props.navigation.navigate("Dining",{"prevName":"You came from hotel services Page"})}
        >
    <Text style={{fontSize: 25, marginLeft:30}}>  Dining </Text>
    </TouchableOpacity>

  </View> 
  <View style={styles.services}>
  <TouchableOpacity   
      onPress={()=>props.navigation.navigate("Laundry",{"prevName":"You came from hotel services Page"})}
        >
    <Text style={{fontSize: 25, marginLeft:30}}>  Laundry </Text>
    </TouchableOpacity>
  
  </View> 
  <View style={styles.services}>
  <TouchableOpacity   
      onPress={()=>props.navigation.navigate("Wifi",{"prevName":"You came from hotel services Page"})}
        >
    <Text style={{fontSize: 25, marginLeft:15}}>  Wifi Details </Text>
    </TouchableOpacity>

  </View> 

  <View style={styles.services}>
  <TouchableOpacity   
      onPress={()=>props.navigation.navigate("upgrade",{"prevName":"You came from hotel services Page"})}
        >
    <Text style={{fontSize: 25,marginLeft:-5}}>Upgrade Room</Text>
    </TouchableOpacity>

  </View> 

  </View>
  );
}

function Upgrade_Room(props) {
return (
  <View style={styles.service}>

<ImageBackground source={upgrade_img} resizeMode="cover" style={{height:840, width:440, flex : 1}}>
    </ImageBackground>  

    </View>
)
}

function Dining_menu(props) {

  const [Cost, setCost] = useState(null);
  const [cost_tacos, setcost_tacos] = useState(null);
  const [cost_nachos, setcost_nachos] = useState(null);
  const [cost_sushi, setcost_sushi] = useState(null);
  const [cost_burger, setcost_burger] = useState(null);

  const price_list=  [{ itemName: "tacos", prodcost: 9.9}, {itemName: "nachos", prodcost: 7}, {itemName: "sushi", prodcost: 12}, {itemName: "burger", prodcost: 9}]

  const get_cost = (key,count) =>{

    let i =0
 

    for(i = 0; i < 4; i++){
      if (key == price_list[i].itemName && key == "tacos"){
        console.log("count sent :", count, "Item :", price_list[i].itemName , "key :", key, "exiting cost of shirts: ", cost_tacos," total cost :", Cost )

        let cost_prod = price_list[i].prodcost * count 
        console.log("calculated cost prod : ", cost_prod, "original prodcost from arr : ", price_list[i].prodcost , "count sent : ", count, "existing cost shirt :", cost_tacos)



        setcost_tacos(cost_prod)

        console.log("Updated cost shirt :", cost_tacos)
   
        cost_prod = 0 
        console.log("Item :", price_list[i].itemName , "key :", key, "new cost of shirts: ", cost_tacos," total cost UPDATED:", Cost )

        break;
      }
      else if (key == price_list[i].itemName && key == "nachos"){

        let cost_prod = price_list[i].prodcost * count

        setcost_nachos(cost_prod)

     
        cost_prod = 0 
        break;
      }   
       else if (key == price_list[i].itemName && key == "sushi"){

        let cost_prod = price_list[i].prodcost * count

        setcost_sushi(cost_prod)


        cost_prod = 0 
        break;
      
      }
      else if (key == price_list[i].itemName && key == "burger"){

        let cost_prod = price_list[i].prodcost * count

        setcost_burger(cost_prod)

        cost_prod = 0 
        break;
      }
    }



  }


  return (
  <View style={styles.service}>


<ImageBackground source={dining_img} resizeMode="cover" style={{height:840, width:440, flex : 1}}>
    </ImageBackground>  

  <View style={styles.panels}>
  
  <CounterInput increaseButtonBackgroundColor="black" decreaseButtonBackgroundColor="black" horizontal style={{marginLeft:100, height:15, width:100}}
  onChange={(counter) => {
    let count = counter
    get_cost("tacos", count)
    console.log("onChange Counter:", counter);
  }}
  />
  <Text style={{marginTop:-30, fontSize:25}}>  Tacos </Text>

  </View> 

  <View style={styles.panels}>
  
  <CounterInput increaseButtonBackgroundColor="black" decreaseButtonBackgroundColor="black" horizontal style={{marginLeft:100, height:15, width:100}}
  onChange={(counter) => {
    let count = counter
    get_cost("nachos", count)
    console.log("onChange Counter:", counter);
  }}
  />


    <Text style={{marginTop:-30, fontSize:25}}>  Nachos</Text>

  </View> 

  <View style={styles.panels}>
  
  <CounterInput increaseButtonBackgroundColor="black" decreaseButtonBackgroundColor="black" horizontal style={{marginLeft:100, height:15, width:100}}
  onChange={(counter) => {
    let count = counter
    get_cost("sushi", count)
    console.log("onChange Counter:", counter);
  }}
  />


    <Text style={{marginTop:-30, fontSize:25}}>  Sushi </Text>

  </View> 
  
  <View style={styles.panels_down}>
  
  <CounterInput increaseButtonBackgroundColor="black" decreaseButtonBackgroundColor="black" horizontal style={{marginLeft:100, height:15, width:100}}
  onChange={(counter) => {
    let count = counter
    get_cost("burger", count)
    console.log("onChange Counter:", counter);
  }}
  />

 
    <Text style={{marginTop:-30, fontSize:25}}>  Burger </Text>
    

  </View> 
  <Text onPress={()=>props.navigation.navigate("Checkout", {"tacos": cost_tacos, "nachos":cost_nachos, "sushi":cost_sushi, "burger":cost_burger})} style={{marginBottom:60, fontSize: 20, color:"blue"}}> Continue to checkout </Text>

 

   </View>
  );
}

function Laundry_rates(props) {
  // let cost = 0
  const [Cost, setCost] = useState(null);
  const [cost_shirt, setcost_shirt] = useState(null);
  const [cost_jackets, setcost_jackets] = useState(null);
  const [cost_dress, setcost_dress] = useState(null);
  const [cost_jeans, setcost_jeans] = useState(null);

  const price_list=  [{ itemName: "shirt", prodcost: 20}, {itemName: "jacket", prodcost: 30}, {itemName: "dress", prodcost: 40}, {itemName: "jeans", prodcost: 25}]

  function set_shirt_cost(state, props) {
    return {...state, cost_shirt: state.count + 1};
  }

  const get_total_bill=()=>{

    
   setCost(cost_shirt + cost_dress + cost_jackets + cost_jeans)
  }

    const get_cost = (key,count) =>{

    let i =0
 
    for(i = 0; i < 4; i++){
      if (key == price_list[i].itemName && key == "shirt"){
        console.log("count sent :", count, "Item :", price_list[i].itemName , "key :", key, "exiting cost of shirts: ", cost_shirt," total cost :", Cost )

        let cost_prod = price_list[i].prodcost * count 
        console.log("calculated cost prod : ", cost_prod, "original prodcost from arr : ", price_list[i].prodcost , "count sent : ", count, "existing cost shirt :", cost_shirt)
  
        setcost_shirt(cost_prod)

        console.log("Updated cost shirt :", cost_shirt)
  
        cost_prod = 0 
        console.log("Item :", price_list[i].itemName , "key :", key, "new cost of shirts: ", cost_shirt," total cost UPDATED:", Cost )

        break;
      }
      else if (key == price_list[i].itemName && key == "jacket"){

        let cost_prod = price_list[i].prodcost * count
    

        setcost_jackets(cost_prod)

   
        cost_prod = 0 
        break;
      }   
       else if (key == price_list[i].itemName && key == "dress"){

        let cost_prod = price_list[i].prodcost * count

        setcost_dress(cost_prod)

        cost_prod = 0 
        break;
      
      }
      else if (key == price_list[i].itemName && key == "jeans"){

        let cost_prod = price_list[i].prodcost * count

        setcost_jeans(cost_prod)

        cost_prod = 0 
        break;
      }
    }



  }


  return (
  <View style={styles.service}>

<ImageBackground source={laundry_img} resizeMode="cover" style={{height:840, width:440, flex : 1}}>
    </ImageBackground>  

<View style={styles.panels}>
  
  <CounterInput increaseButtonBackgroundColor="black"  decreaseButtonBackgroundColor="black"  horizontal style={{marginLeft:110, height:15, width:80}}
  onChange={(counter) => {
    let count = counter
    get_cost("shirt", count)
    console.log("onChange Counter:", counter);
  }}
  />

    <Text style={{marginTop:-30, fontSize:25}}>  Shirt </Text>
  </View> 
 

  <View style={styles.panels}>
  
  <CounterInput increaseButtonBackgroundColor="black"   decreaseButtonBackgroundColor="black" horizontal style={{marginLeft:100, height:15, width:80}}
  onChange={(counter) => {
    let count = counter
    get_cost("jacket", count)
    console.log("onChange Counter:", counter);
  }}
  />

    <Text style={{marginTop:-30, fontSize:25}}>  Jacket </Text>
   
  </View> 

  <View style={styles.panels}>
  
  <CounterInput increaseButtonBackgroundColor="black"  decreaseButtonBackgroundColor="black" horizontal style={{marginLeft:100, height:15, width:80}}
  onChange={(counter) => {
    let count = counter
    get_cost("dress", count)
    console.log("onChange Counter:", counter);
  }}
  />

    <Text style={{marginTop:-30, fontSize:25}}> Dress </Text>

  </View> 

  <View style={styles.panels_down}>
  
  <CounterInput increaseButtonBackgroundColor="black" decreaseButtonBackgroundColor="black" horizontal style={{marginLeft:100, height:15, width:80}}
  onChange={(counter) => {
    let count = counter
    get_cost("jeans", count)

    console.log("onChange Counter:", counter);
  }}
  />

    <Text style={{marginTop:-30, fontSize:25}}>  Jeans</Text>

  </View> 


      <Text onPress={()=>props.navigation.navigate("Checkout",{"shirt": cost_shirt , "total": Cost,  "jacket": cost_jackets, "jeans": cost_jeans, "dress": cost_dress})} style={{marginBottom:60, fontSize: 20, color:"blue"}}> Continue to checkout </Text>

   
  
  </View>
  );
}

function Wifi_Details(props) {
  return (
  <View style={styles.service}>
      <ImageBackground source={wifi} resizeMode="cover" style={{height:200, width:400}}>
     {/* <Text style={styles.text}>Inside</Text>  */}
    </ImageBackground>  

    
   {/* <Text> Wifi Password : "HelloGlobetrotter"</Text> */}
   <View style={styles.Wifi}>
    <Text style = {{color: 'black', fontSize: 20}}> Wifi Password : "HelloGlobetrotter"</Text>
    <Text style = {{color: 'black', marginTop: 40}}> Room number : 409 </Text>

    
  </View>

   <View style={styles.panels}>
   <TouchableOpacity   
      onPress={()=>props.navigation.navigate("Services",{"prevName":"You came from hotel services Page"})}
        >
    <Text>  back to hotel services</Text>
    </TouchableOpacity>

  </View> 

  </View>
  );
}

function Checkout_bill(props) {

  let tot_laundry = 0
  if(props.route.params.jacket || props.route.params.dress || props.route.params.jeans || props.route.params.shirt) {

  tot_laundry = (props.route.params.jacket + props.route.params.dress + props.route.params.jeans + props.route.params.shirt) 
  console.log("jacket", props.route.params.jacket )
  console.log("dress", props.route.params.dress)
  console.log("jeans", props.route.params.jeans)
  console.log("shirt", props.route.params.shirt)
  console.log("laundry", tot_laundry)
  }

  let tot_food = 0



  if(props.route.params.tacos || props.route.params.nachos || props.route.params.sushi || props.route.params.burger) {
      tot_food = ( props.route.params.tacos + props.route.params.nachos + props.route.params.sushi + props.route.params.burger)
      console.log("food", tot_food)
  }

  let tot_cost = (tot_food + tot_laundry)

  const [total, settotal] = useState(tot_cost);
  tot_cost = 0
  tot_laundry = 0
  tot_food = 0

  // settotal(tot_cost)
  // console.log("checkout", tot_cost)
  console.log("total", total)

  const get_total_bill=()=>{
    alert("yayyy")

  //  settotal(5)
  }
  return(
  <View style={styles.end_bill}>

   <Text style = {{color: 'black', fontSize: 30,marginTop:-20, fontFamily:"Baskerville"}}> View your bill</Text>

   <View style={styles.checkout}>

    {/* {get_total_bill()} */}

    {props.route.params.shirt ? <Text style = {{color: 'black', fontSize: 25}}> Shirt:                       {props.route.params.shirt}  </Text> : null }
    {props.route.params.jacket  ? <Text style = {{color: 'black', fontSize: 25}}>Jackets:                  {props.route.params.jacket}  </Text> : null }
    {props.route.params.dress ? <Text style = {{color: 'black', fontSize: 25}}> Dress:                     {props.route.params.dress} </Text> : null }
    {props.route.params.jeans ? <Text style = {{color: 'black', fontSize: 25}}> Jeans:                     {props.route.params.jeans} </Text> : null }

    {props.route.params.tacos ?<Text style = {{color: 'black', fontSize: 25}}> Tacos:                {props.route.params.tacos} </Text> : null}
    {props.route.params.nachos ?<Text style = {{color: 'black', fontSize: 25}}> Nachos:             {props.route.params.nachos} </Text> : null}
    {props.route.params.sushi ?<Text style = {{color: 'black', fontSize: 25}}> Sushi:                 {props.route.params.sushi} </Text> : null}
    {props.route.params.burger ?<Text style = {{color: 'black', fontSize: 25}}> Burger:               {props.route.params.burger} </Text> : null}
    <Text > --------------------------------------</Text>

    {total ? <Text style = {{color: 'black', fontSize: 26}}> Your total bill: $ {total}  </Text> : <Text style = {{color: 'black', fontSize: 26}}> No items Ordered  </Text> }
    </View>

  <Text onPress={()=>props.navigation.navigate("Checkout", {"tacos": cost_tacos, "nachos":cost_nachos, "sushi":cost_sushi, "burger":cost_burger})} style={{marginTop: -50,marginBottom:300, fontSize: 30, color:"blue"}}> Proceed to pay </Text>


    
  </View>

  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
    backgroundColor: '#cef8f3',

  },
  header: {
    marginTop: 100,
    // flex : 1,
    backgroundColor: 'skyblue',
    // // alignItems: 'top',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",

    padding: 30,
    paddingLeft: 100,
    paddingRight: 100,
    marginBottom: 150,
    
  },
  Main: {
    // flex : 2,
    backgroundColor: '#339966',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",
    padding: 90,
    marginBottom: 100,
  },

  Wifi: {
    // flex : 2,
    backgroundColor: '#339966',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",
    padding: 110,
    marginTop: 40,
    marginBottom: 80,
    
  },
  
  body: {
    // flex : 2,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: "lightgray",
    flexDirection: "column",
    // padding: 90,
    marginTop: 20,
  },

  bottom: {
    // marginTop: 100,
    // flex : 1,
    backgroundColor: 'skyblue',
    // alignItems: 'top',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",

    padding: 20,
    paddingLeft: 100,
    paddingRight: 100,
    marginBottom: 200,

  },
  panels : {
    // marginTop: 100,
    // flex : 1,
    backgroundColor: 'skyblue',
    // alignItems: 'top',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",

    padding: 30,
    paddingLeft: 50,
    paddingRight: 50,
    marginBottom: 90,


  },
  panels_down : {
    // marginTop: 100,
    // flex : 1,
    backgroundColor: 'skyblue',
    // alignItems: 'top',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",

    padding: 30,
    paddingLeft: 50,
    paddingRight: 50,
    marginBottom: 50,


  },
  service:{
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 3,
    margin: 6,
    flexDirection: 'column', 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#cef8f3',

  },
  services:{
  // marginTop: 100,
    // flex : 1,
    backgroundColor: 'skyblue',
    // alignItems: 'top',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",

    padding: 30,
    paddingLeft: 50,
    paddingRight: 50,
    width: 270,
    height:100,
    marginBottom: 90,
    marginTop : 20,

  },
  image: {
    flex: 1,
    width: 600, 
    height: 900,
    // justifyContent: "center"
  },
  map: {
    width: 450,
    height:450
  },
  checkout: {
      // marginTop: 100,
    // flex : 1,
    backgroundColor: 'skyblue',
    // alignItems: 'top',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "grey",
    flexDirection: "column",

    padding: 20,
    paddingLeft: 50,
    paddingRight: 50,
    width: 350,
    height:500,
    marginBottom: 90,
    marginTop: 60,
  },
  end_bill:{
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 100,
    margin: 6,
    flexDirection: 'column', 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#cef8f3',

  },
});
