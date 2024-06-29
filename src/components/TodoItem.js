import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function TodoItem({ data }) {
    //  console.warn(data)
    return (

        <View style={styles.container}>
            <View styles={styles.itemHeader}>TodoItem</View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {},
    itemHeader: {},
})