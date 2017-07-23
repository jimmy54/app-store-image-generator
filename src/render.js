import React from 'react';
import { render, Artboard, Text, View, StyleSheet, Image } from 'react-sketchapp';
import translations from '../translations/text.json';

const layout = {
    width: 414,
    height: 736,
    cols: 5,
    margin: 100
}

const styles ={
    title: {
        width: 414,
        fontSize: 22,
        lineHeight: 32,
        fontFamily: 'SF Pro Display',
        fontWeight: 'bold',
        color: '#ffffff',
        paddingTop: 35,
        paddingBottom: 35,
        paddingLeft: 25,
        paddingRight: 25,
        textAlign: 'center'
    },
    container: {
        position: 'relative'
    },
    phone: {
        width: 365,
        height: 743
    },
    screenshot: {
        borderWidth: 1,
        borderColor: '#000000',
        top: 90,
        left: 24,
        height: 558,
        width: 316,
        position: 'absolute'
    }
};

const getArtboardStyle = i => {
    const { width, height, cols, margin } = layout;
    const x = i % cols;
    const y = (i - x) / cols;
    // Top and left are switched for some reason.
    const top = x * (width + margin) + margin; 
    const left = y * (height + margin) + margin;
    return {
        left,
        top,
        width,
        height,
        position: 'fixed',
        backgroundColor: '#4a90e2', // set artboard background color here
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}

const getParentStyle = count => {
    const { width, height, cols, margin } = layout;
    const rows = (count - (count % cols)) / cols;
    const totalHeight = rows * (height + margin) + margin;
    const totalWidth = cols * (width + margin) + margin;
    return {
        top: 0,
        left: 0,
        width: totalWidth,
        height: totalHeight,
        backgroundColor: '#eee'
    }
}

const StoreImage = ({item, index}) => {
    const path = `${meta.url}/${item.locale}/${meta.device}-${item.screenshot}-${meta.hash}.png`;
    return (
        <Artboard name={`iOS_${meta.version}_${item.locale}_${item.screenshot}`} style={getArtboardStyle(index)}>
            <Text style={styles.title}>{item.text}</Text>
            <View style={styles.container}>
                <Image source={meta.url+'/'+meta.frame} style={styles.phone} />
                <Image source={path} style={styles.screenshot} />
            </View>
        </Artboard>
    );
}

const locales = ['da-DA', 'de-AT', 'de-CH', 'de-DE', 'en-AU', 'en-GB', 'en-US', 'es-ES', 'es-MX', 'fr-FR', 'it-IT', 'nb-NO', 'nl-NL', 'pl-PL', 'ru-RU', 'sv-SV'];
const selectedScreenshots = [ '0FD', '1List1', '2Filters', '3Maps', '4Details1'];
const meta = {
    url: 'http://localhost:5000',
    device: 'iPhone6Plus',
    hash: 'd41d8cd98f00b204e9800998ecf8427e',
    version: '1.7.1',
    frame: 'frame@1x.png'
}

mergeData = () => {
    const data = [];
    for (var j = 0; j < locales.length; j++) {
        const locale = locales[j];
        
        for (let i = 0; i < selectedScreenshots.length; i++) {
            let text = translations.filter((item) => {
                if(item['field1'] === 'screenshot #'+(i+1)) return true;
                return false;
            })[0];

            let textLocale = locale;
            if(locale === 'de-DE' || locale === 'de-AT' || locale === 'de-CH') textLocale = 'de-AT, de-DE, de-CH'; 
            if(locale === 'pl-PL') textLocale = 'Polish'; 

            data.push({ 
                locale, 
                screenshot: selectedScreenshots[i], 
                text: text[textLocale]
            });
        }    
    }
    return data;
}

export default (context) => {
    
    const data = mergeData();
    const container  = <Artboard name="container" style={getParentStyle(data.length)}> 
        {data.map((item, index) => <StoreImage key={index} item={item} index={index}/>)}
    </Artboard>
    render(container, context.document.currentPage())
}   