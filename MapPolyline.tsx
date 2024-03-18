import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { Alert, Text, View, StyleSheet, Pressable } from "react-native";
import MapView, {Polyline} from 'react-native-maps';

const MapPolyline = () => {
    const [points, setPoints] = useState<{ latitude: number; longitude: number; }[]>([]);

    useEffect(()=>{
        const GetPoints = async () => {
            try{
                const pointstr = await AsyncStorage.getItem('polyline');
                if (pointstr){
                    const point = JSON.parse(pointstr);
                    const coordinate = {'latitude': point.latitude, 'longitude': point.longitude}
                    setPoints(prev => [...prev, coordinate]);
                }
            }catch(e:any){
                Alert.alert(e.message);
            }
        }

        const get = setInterval(GetPoints, 10000);
        return () => clearInterval(get);
    },[])

    return(
        <View>
            <MapView>
                <Polyline coordinates={points}>

                </Polyline>
            </MapView>
        </View>
    )
}

export default MapPolyline;
