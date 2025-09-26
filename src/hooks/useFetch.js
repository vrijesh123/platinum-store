"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export default function useFetch(apiEndpoint, initialPath) {
    const [data, setData] = useState([]);
    const [nextUrl, setNextUrl] = useState(null); // For next page URL
    const [prevUrl, setPrevUrl] = useState(null); // For previous page URL
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [totalPages, setTotalPages] = useState(0); // State for total pages
    const [totalItems, setTotalItems] = useState(0);
    const [filterParams, setFilterParams] = useState(null);
    const [filterEndpoint, setFilterEndpoint] = useState(null)


    // Fetch data from a given URL
    const fetchData = useCallback(
        async ({ url, pageNumber, filterParams, filterEndpoint } = {}) => {
            setError(null);
            try {
                let response;


                if (filterParams) {
                    // When filtering, use a POST request with filters and the page number.
                    response = await filterEndpoint.get(`?page=${pageNumber}${filterParams}`);
                } else {

                    // console.log('fetchUrl', apiEndpoint, initialPath)

                    let fetchUrl = url || initialPath;
                    const urlObj = new URL(apiEndpoint.config.baseURL + fetchUrl);

                    if (pageNumber) {
                        urlObj.searchParams.set('page', pageNumber);
                    }
                    fetchUrl = urlObj.pathname;

                    response = await apiEndpoint.get(initialPath);

                }

                // Process response...
                const results = response?.results || [];

                setData(results);

                setNextUrl(response?.links?.next);
                setPrevUrl(response?.links?.previous);
                const totalItems = response?.total_items || 0;
                setTotalItems(totalItems);
                const pageSize = 24;
                setTotalPages(Math.ceil(totalItems / pageSize));
                setCurrentPage(pageNumber || 1);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [apiEndpoint, initialPath]
    );


    // Fetch the initial data
    const fetchInitialData = useCallback(() => {
        fetchData(initialPath);
    }, [fetchData, initialPath]);

    const fetchPageData = useCallback(
        (pageNumber, params, filterEndpoint) => {
            fetchData({ pageNumber, filterParams: params, filterEndpoint });
        },
        [fetchData, filterParams]
    );


    const deleteItem = useCallback(async (e, apiEndpoint, idArray) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); // Reset error before deleting

        try {
            // Use POST requests with IDs in the request body
            await Promise.all(
                idArray?.map(id =>
                    apiEndpoint.post('/', { id }) // Post request with ID in the body
                )
            );

            // Refetch the current page data after deletion
            fetchData(initialPath);
            toast.success('Successfully deleted')
        } catch (err) {
            setError(err);
            toast.error(err)
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint, fetchData, initialPath]);




    // Edit an item and refresh the data
    const editItem = useCallback(async (e, id, updateData) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); // Reset error before updating
        try {
            await apiEndpoint.put(`/${id}`, updateData);
            // Refetch the current page data after update
            fetchData(initialPath);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint, fetchData, initialPath]);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    return {
        data,
        setData,
        fetchData,
        nextUrl,
        setNextUrl,
        prevUrl,
        setPrevUrl,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        totalItems,
        setTotalItems,
        fetchPageData,
        fetchInitialData,
        error,
        isLoading,
        setIsLoading,
        deleteItem,
        editItem,
        setFilterParams,
        setFilterEndpoint
    };
}