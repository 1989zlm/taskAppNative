import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../themes/Colors'

//! onchange text i TaskList Screen sayfasından buara prop olarak aldık inputtaki verileri almak için

export default function CustomTextInput({ imageSource, onChangeText, value, ...rest }) {

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.inputContainer}>
                <Image source={imageSource} style={styles.image} />
                <TextInput
                    value={value}
                    {...rest}
                    onChangeText={onChangeText}
                    style={styles.textInput}

                />
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 15,
    },
    image: {
        width: 20,
        height: 20,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 15,
    }
})