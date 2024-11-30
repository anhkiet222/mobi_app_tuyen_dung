import { StyleSheet, ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';
import React from 'react';
import { useWindowDimensions } from 'react-native';

const ReadHTML = ({ data }) => {
    const { width } = useWindowDimensions();

    // Sử dụng useMemo để tối ưu hóa nội dung HTML
    const htmlContent = React.useMemo(() => {
        return data?.descriptionHTML || '';
    }, [data?.descriptionHTML]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <RenderHTML
                contentWidth={width}
                source={{ html: htmlContent }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5ef',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#dddddd',
        marginBottom: 25,
    },
});

export default ReadHTML;