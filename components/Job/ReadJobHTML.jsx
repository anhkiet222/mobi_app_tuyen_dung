import { StyleSheet, ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';
import React from 'react';
import { useWindowDimensions } from 'react-native';

const ReadHTML = ({ data = {} }) => {
    const { width } = useWindowDimensions();

    const tagsStyles = React.useMemo(() => ({
        h2: styles.title,
        ol: styles.list,
        li: styles.listItem,
    }), []);

    const htmlContent = React.useMemo(() => {
        return data?.descriptionHTMLValue || '';
    }, [data?.descriptionHTMLValue]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <RenderHTML
                contentWidth={width}
                source={{ html: htmlContent }}
                tagsStyles={tagsStyles}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    list: {
        backgroundColor: '#f9f9f9',
        padding: 30,
        borderRadius: 5,
        borderColor: '#dddddd',
        borderWidth: 1,
    },
    listItem: {
        fontSize: 16,
    },
});

export default ReadHTML;