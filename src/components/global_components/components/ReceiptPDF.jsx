"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoSans",
  src: "https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNr6DRAW_0.woff2",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    backgroundColor: "#fff",
    padding: 30,
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  receiptId: {
    fontSize: 10,
    color: "#666",
  },
  logoBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 6,
    textAlign: "center",
    width: 80,
  },
  sectionRow: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 10,
  },
  column: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    backgroundColor: "#f8f8f8",
    fontWeight: "bold",
  },
  totalBalance: {
    textAlign: "right",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
});

export const ReceiptPDF = ({ data }) => {
  const {
    id,
    date,
    paymentMode,
    billedTo,
    from,
    paymentReceived,
    totalAmount,
    balance,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>RECEIPT</Text>
            <Text style={styles.receiptId}>#{id}</Text>
          </View>
          <View style={styles.logoBox}>
            <Text>Client Logo</Text>
          </View>
        </View>

        {/* Details Row */}
        <View style={styles.sectionRow}>
          <View style={styles.column}>
            <Text style={styles.label}>Issued</Text>
            <Text>{date}</Text>
            <Text style={[styles.label, { marginTop: 5 }]}>Payment Mode</Text>
            <Text>{paymentMode}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Billed to</Text>
            <Text>{billedTo.name}</Text>
            <Text>{billedTo.phone}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>From</Text>
            <Text>{from.name}</Text>
            <Text>{from.address}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Payment Received</Text>
            <Text style={styles.tableCell}>Total Amount</Text>
            <Text style={styles.tableCell}>Balance</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              Rs {paymentReceived.toLocaleString()}.00
            </Text>
            <Text style={styles.tableCell}>
              Rs {totalAmount.toLocaleString()}.00
            </Text>
            <Text style={styles.tableCell}>
              Rs {balance.toLocaleString()}.00
            </Text>
          </View>
        </View>

        <Text style={styles.totalBalance}>
          Total Balance Rs {balance.toLocaleString()}.00
        </Text>
      </Page>
    </Document>
  );
};
