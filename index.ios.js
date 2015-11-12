/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
} = React;
var Beacons = require('react-native-ibeacon');

var region = {
    identifier: 'Estimotes',
    uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
};

var CartoBeacons = React.createClass({
  getInitialState:function(){
    return {beaconData:{beacons:[]}}
  },
  componentDidMount:function(){
    // Beacons.requestWhenInUseAuthorization();
    Beacons.requestAlwaysAuthorization();
    Beacons.startMonitoringForRegion(region);
    Beacons.startRangingBeaconsInRegion(region);
    Beacons.startUpdatingLocation();
    var subscription = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        this.setState({beaconData: data})
        var nearest = data.sort((a,b)=> a.rssi < b.rssi)[0]

        fetch("https://{account}.cartodb.com/api/v2/sql?q={insert into beaconcheckins}", method:'POST', body: JSON.stringify({user:"stuart", beacon: nearest.minor}))
        // data.region - The current region
        // data.region.identifier
        // data.region.uuid

        // data.beacons - Array of all beacons inside a region
        //  in the following structure:
        //    .uuid
        //    .major - The major version of a beacon
        //    .minor - The minor version of a beacon
        //    .rssi - Signal strength: RSSI value (between -100 and 0)
        //    .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
        //    .accuracy - The accuracy of a beacon
      }
    );

  },
  ranges: function(){

  },
  beaconSummary:function(beacon){
    return(
      <View>
        <Text>rssi: {beacon.rssi}</Text>
        <Text>major: {beacon.major}</Text>
        <Text>minor: {beacon.minor}</Text>
        <Text>proximity: {beacon.proximity}</Text>
        <Text>accuracy: {beacon.accuracy}</Text>
      </View>
    )
  },
  nearestBeacon:function(){

  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          have {Object.keys(this.state.beaconData).length}
        </Text>

        {this.state.beaconData.beacons.sort((b1,b2)=> b1.minor > b2.minor ).map(this.beaconSummary)}

        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('CartoBeacons', () => CartoBeacons);
