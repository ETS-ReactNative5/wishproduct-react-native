import {  StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    // width:'100%',
    // alignItems: 'stretch',
    // justifyContent: 'center',
    // backgroundColor: '#e9f7fd',

    flex: 1,
    // flex: 0,
    width:'100%',
    // alignItems: 'center',
    alignItems: 'stretch',
    // justifyContent: 'center', 
    backgroundColor: '#e9f7fd',
    flexDirection:'column',
    height: 'auto', 
  },
  textLabel:{
    textAlign: 'left', 
    paddingLeft:0, 
    marginLeft:10, 
    marginTop:5,
    color:'black',
    fontSize:14,
    fontWeight:'bold',
  },
  row: {
    margin: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  rowText: {
    fontSize: 18,
  },
  btnHoanTat:{
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    marginTop:10,
    marginBottom:10,
    borderRadius: 5,
    padding: 1,
    backgroundColor: '#88cc88',
    height:40,
  },
  btnChiTiet:{
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    marginTop:10,
    marginBottom:10,
    borderRadius: 5,
    padding: 1,
    backgroundColor: 'blue',
    height:40,
  },

});
export default styles;