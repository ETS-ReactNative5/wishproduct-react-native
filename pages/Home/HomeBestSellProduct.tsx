import React from 'react';
import {View, ViewStyle, StyleSheet, TextStyle, Image, Text, TouchableOpacity} from 'react-native';
import {AppTheme} from '../../config/DefaultConfig';
import useTheme from '../../hooks/useTheme';

interface Props {
  goToDetails?: () => void;
  item?: object;
}

const HomeBestSellProduct: React.FunctionComponent<Props> = ({goToDetails, item = {}}: Props) => {
  const theme: AppTheme = useTheme();
  return (
    <TouchableOpacity key={item['id']} style={[style.newItemBox]} onPress={goToDetails}>
      <Image style={[style.imageItem]} source={{uri: item['thumbnail']}} />
      <View>
        <Text style={{color: 'black', fontSize: 12, fontWeight: 'bold'}}>{item['title'] || item['name']}</Text>
      </View>
      <View>
        <Text>
          <Text style={{color: 'red', fontWeight: 'bold', marginLeft: 10}}>{item['priceText']}</Text>
          {item['prePriceText'] && item['prePriceText'] !== item['priceText'] ? (
            <Text style={{color: '#878787', fontSize: 12, fontWeight: '400', paddingRight: 10, marginRight: 10, textDecorationLine: 'line-through'}}>{` ` + item['prePriceText']}</Text>
          ) : null}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeBestSellProduct;
const style: any = StyleSheet.create<any>({
  newItemBox: {
    flexDirection: 'column',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    borderRadius: 0,
    overflow: 'hidden',
    // height: 300,
    width: 140,
    marginRight: 10,
    marginBottom: 50,
  },
  newItem: {
    marginLeft: 6,
    marginRight: 6,
    width: 120,
    height: 100,
    borderRadius: 0,
  },
  imageItem: {
    marginLeft: 6,
    marginRight: 6,
    width: 120,
    height: 100,
    borderRadius: 0,
  },
  itemTitleView: {
    position: 'absolute',
    width: '90%',
    top: 130,
    left: 15,
    borderRadius: 0,
    padding: 2,
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden',
  },
});
