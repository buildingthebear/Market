import type {NextPage} from 'next'
import Head from 'next/head'
import {SupportedLocale, SUPPORTED_LOCALES, SwapWidget, Theme} from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import Web3Connectors from '../components/Web3Connectors'
import {useActiveProvider} from '../connectors'
import React, {useCallback, useRef, useState} from 'react'
import Script from 'next/script'
import StakingComponent from "../components/SingleStaking";
import singleStaking from "../components/SingleStaking";

const TOKEN_LIST = [
    {
        "name": "Build the Bear",
        "address": "0xAB8FEfd4CbB4884491053A1d84E7Af17317dA40C",
        "symbol": "BTB",
        "decimals": 9,
        "chainId": 1,
        "logoURI": "https://www.buildthebear.market/img/btb-logo-solid-colorway-1.png"
    },
    {
        "name": "Dai Stablecoin",
        "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "symbol": "DAI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
    },
    {
        "name": "Tether USD",
        "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "symbol": "USDT",
        "decimals": 6,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
    },
    {
        "name": "USD Coin",
        "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "symbol": "USDC",
        "decimals": 6,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
    },
]

const BTB = '0xAB8FEfd4CbB4884491053A1d84E7Af17317dA40C'
const theme: Theme = {
    primary: '#1F4A05',
    secondary: 'rgba(0, 0, 0, 0.25)',
    interactive: '#FFF',
    container: '#ffedc2',
    module: '#FFF',
    accent: '#fa9d4c',
    outline: '#CADDC2',
    dialog: '#FFF',
    borderRadius: 0.2,
}

function connectWallet() {
    let element: HTMLElement = document.querySelector('.walletConnector:first-of-type button') as HTMLElement;
    element.click();
}

const Home: NextPage = () => {
    const connectors = useRef<HTMLDivElement>(null)
    const focusConnectors = useCallback(() => connectWallet(), [])

    const pr = useActiveProvider()

    return (
        <div>
            <Head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Build the Bear Market</title>
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico"/>
            </Head>
            <div className={"bg bg1"}></div>
            <div className={"bg bg2"}></div>
            <div className={"bg bg3"}></div>
            <main>
                <div id="walletConnectors" ref={connectors}>
                    <Web3Connectors/>
                </div>
                <div id="welcomeMessage">
                    <h2>
                        Build the Bear . Market{" "}
                        <svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048"
                             version="1.1">
                            <path
                                d="M 1252.500 984.965 C 1247 986.512, 1180.175 1005.649, 1104 1027.492 C 1027.825 1049.335, 962.582 1068.029, 959.015 1069.034 C 951.861 1071.050, 949 1073.633, 949 1078.076 C 949 1081.213, 950.532 1083.201, 964.345 1098 C 984.467 1119.558, 990.977 1130.134, 994.049 1146.259 C 998.271 1168.416, 999.472 1191.066, 999.441 1248 C 999.425 1277.425, 998.879 1311.400, 998.229 1323.500 C 997.578 1335.600, 996.152 1364.175, 995.058 1387 C 993.965 1409.825, 992.588 1438.400, 991.998 1450.500 C 991.408 1462.600, 990.500 1474.750, 989.981 1477.500 C 989.461 1480.250, 988.355 1487.900, 987.521 1494.500 C 986.688 1501.100, 985.728 1507.969, 985.388 1509.764 C 984.575 1514.049, 986.627 1518.868, 989.579 1519.609 C 994.701 1520.895, 1009.937 1513.118, 1034.500 1496.678 C 1065.013 1476.257, 1119.702 1430.966, 1136.500 1412.206 C 1141.450 1406.677, 1146.006 1402.120, 1146.625 1402.077 C 1147.244 1402.035, 1153.055 1404.493, 1159.539 1407.539 C 1192.641 1423.093, 1238.248 1438.056, 1269.278 1443.544 C 1280.823 1445.585, 1284.783 1444.920, 1286.864 1440.591 C 1287.692 1438.868, 1288.576 1431.418, 1289.114 1421.627 C 1289.601 1412.757, 1290.659 1396.950, 1291.465 1386.500 C 1292.270 1376.050, 1293.194 1361.425, 1293.518 1354 C 1293.842 1346.575, 1294.741 1331.500, 1295.517 1320.500 C 1296.292 1309.500, 1296.914 1296.900, 1296.900 1292.500 C 1296.795 1260.125, 1297.763 1232.913, 1299.940 1207 C 1302.581 1175.569, 1305.289 1092.250, 1304.718 1060 C 1304.126 1026.598, 1302.440 1020.998, 1287.782 1003.759 C 1283.227 998.402, 1278.398 992.597, 1277.051 990.861 C 1274.279 987.287, 1266.399 981.961, 1264.054 982.077 C 1263.199 982.119, 1258 983.419, 1252.500 984.965"
                                stroke="none" fill="#fbab04"></path>
                            <path
                                d="M 892.500 11.621 C 865.136 15.793, 846.358 19.484, 819.500 25.968 C 797.984 31.162, 798.734 30.948, 749.500 45.987 C 731.350 51.532, 712.675 57.223, 708 58.634 C 703.325 60.045, 697.475 61.815, 695 62.567 C 682.790 66.277, 652.748 75.314, 647 77.007 C 643.425 78.059, 628.125 82.556, 613 86.999 C 585.796 94.990, 556.265 103.838, 499 121.157 C 482.775 126.065, 466.350 130.998, 462.500 132.121 C 458.650 133.244, 452.800 135, 449.500 136.022 C 446.200 137.044, 432.475 141.094, 419 145.023 C 405.525 148.952, 384.825 155.103, 373 158.693 C 361.175 162.283, 349.925 165.662, 348 166.201 C 346.075 166.739, 334.150 170.319, 321.500 174.154 C 308.850 177.990, 294.900 182.207, 290.500 183.525 C 286.100 184.844, 275.075 188.149, 266 190.871 C 256.925 193.593, 239.150 198.831, 226.500 202.511 C 197.119 211.057, 161.077 223.297, 153.246 227.387 C 149.579 229.302, 145.373 233.850, 144.064 237.315 C 143.330 239.256, 143 284.167, 143 381.906 C 143 536.065, 142.748 529.048, 148.547 536.650 C 151.845 540.974, 160.550 546.695, 176.500 555.019 C 183.100 558.463, 195.475 564.980, 204 569.501 C 212.525 574.021, 224 580.091, 229.500 582.989 C 235 585.887, 245.575 591.511, 253 595.486 C 260.425 599.462, 271.450 605.309, 277.500 608.479 C 290.457 615.270, 315.046 628.351, 334 638.538 C 341.425 642.529, 350.425 647.353, 354 649.259 C 357.575 651.165, 376.700 661.388, 396.500 671.978 C 416.300 682.568, 436.550 693.374, 441.500 695.992 C 446.450 698.610, 464.675 708.287, 482 717.497 C 499.325 726.706, 524.525 740.094, 538 747.248 C 551.475 754.402, 575.775 767.341, 592 776 C 608.225 784.659, 635.675 799.282, 653 808.496 C 670.325 817.709, 690.575 828.486, 698 832.444 C 720.305 844.335, 720.415 844.376, 730 844.442 C 737.333 844.492, 740.628 843.860, 754 839.839 C 762.525 837.276, 778.275 832.626, 789 829.507 C 799.725 826.388, 812.775 822.572, 818 821.027 C 823.225 819.481, 832.225 816.841, 838 815.160 C 864.216 807.529, 891.855 799.437, 907 794.960 C 916.075 792.277, 930.700 788, 939.500 785.456 C 948.300 782.912, 961.575 779.053, 969 776.881 C 1002.657 767.035, 1014.213 763.676, 1024 760.894 C 1029.775 759.253, 1039.450 756.415, 1045.500 754.588 C 1051.550 752.761, 1064.600 748.919, 1074.500 746.049 C 1084.400 743.180, 1100.600 738.421, 1110.500 735.473 C 1120.400 732.526, 1141.839 726.277, 1158.142 721.585 C 1174.445 716.894, 1197.395 710.174, 1209.142 706.652 C 1220.889 703.130, 1240.175 697.466, 1252 694.064 C 1263.825 690.663, 1274.625 687.492, 1276 687.018 C 1284.734 684.006, 1309.773 677.562, 1318.941 675.967 C 1348.885 670.755, 1378.891 671.090, 1402.500 676.899 C 1461.981 691.534, 1502.141 726.673, 1511.428 772.208 C 1513.770 783.692, 1513.542 805.570, 1510.957 817.261 C 1504.965 844.367, 1492.211 868.553, 1470.752 893.500 C 1450.185 917.411, 1423.568 937.783, 1391.896 953.852 C 1377.090 961.364, 1354.404 970.904, 1345 973.574 C 1318.874 980.990, 1291.754 988.607, 1282.750 991.057 C 1280.688 991.618, 1279 992.469, 1279 992.949 C 1279 993.429, 1282.839 998.249, 1287.532 1003.661 C 1296.581 1014.096, 1299.687 1019.504, 1302.659 1030 C 1304.337 1035.924, 1304.489 1040.623, 1304.371 1083 C 1304.300 1108.575, 1303.731 1138.500, 1303.107 1149.500 C 1302.483 1160.500, 1301.524 1178.725, 1300.976 1190 C 1300.428 1201.275, 1299.518 1214.775, 1298.953 1220 C 1297.684 1231.751, 1296.051 1282.075, 1296.888 1283.651 C 1297.322 1284.468, 1299.968 1283.992, 1306 1282.011 C 1380.417 1257.569, 1391.935 1254.469, 1421.500 1250.928 C 1451.663 1247.315, 1471.557 1248.988, 1494.605 1257.075 C 1527.681 1268.680, 1555.470 1295.442, 1568.002 1327.759 C 1583.032 1366.516, 1573.313 1407.512, 1539.535 1447.838 C 1511.357 1481.478, 1478.045 1502.214, 1427.737 1517.429 C 1357.219 1538.756, 1319.130 1550.254, 1316.500 1551.008 C 1314.850 1551.482, 1296.400 1557.044, 1275.500 1563.369 C 1184.085 1591.036, 1150.390 1601.183, 1134 1605.983 C 1124.375 1608.801, 1115.375 1611.504, 1114 1611.989 C 1112.625 1612.474, 1106.775 1614.296, 1101 1616.038 C 1095.225 1617.780, 1086.450 1620.476, 1081.500 1622.029 C 1076.550 1623.583, 1064.625 1627.119, 1055 1629.887 C 1045.375 1632.654, 1027.150 1638.130, 1014.500 1642.054 C 1001.850 1645.978, 983.850 1651.420, 974.500 1654.147 C 959.403 1658.551, 934.049 1666.196, 860 1688.674 C 835.907 1695.988, 810.181 1702.659, 791.414 1706.459 C 768.638 1711.072, 737.430 1709.680, 715.204 1703.061 C 711.269 1701.889, 699.826 1696.740, 689.775 1691.618 C 679.724 1686.496, 653.050 1672.952, 630.500 1661.520 C 607.950 1650.088, 579.600 1635.679, 567.500 1629.499 C 555.400 1623.319, 527.950 1609.370, 506.500 1598.501 C 485.050 1587.632, 459.400 1574.582, 449.500 1569.501 C 439.600 1564.419, 410.800 1549.766, 385.500 1536.938 C 360.200 1524.110, 324.200 1505.817, 305.500 1496.287 C 257.867 1472.012, 225.256 1455.939, 206 1447.247 C 151.111 1422.469, 153 1423.185, 147.399 1425.033 C 141.605 1426.946, 140.931 1429.007, 139.989 1447.700 C 138.348 1480.281, 136.912 1526.055, 135.965 1576 C 135.439 1603.775, 134.524 1646.525, 133.933 1671 C 133.342 1695.475, 133.002 1720.937, 133.179 1727.582 C 133.484 1739.068, 133.639 1739.846, 136.330 1743.370 C 139.886 1748.027, 137.371 1746.478, 195 1779.501 C 221.675 1794.786, 260.375 1816.978, 281 1828.817 C 317.976 1850.041, 328.326 1855.955, 349 1867.671 C 354.775 1870.944, 370.075 1879.721, 383 1887.176 C 395.925 1894.631, 428.325 1913.223, 455 1928.491 C 481.675 1943.759, 504.625 1957.045, 506 1958.015 C 508.388 1959.699, 531.258 1973.169, 545 1980.985 C 557.994 1988.375, 579.280 1999.026, 599.664 2008.337 C 611.124 2013.572, 624.775 2019.838, 630 2022.261 C 642.893 2028.241, 651.805 2031.522, 662.500 2034.225 C 671.123 2036.405, 673.153 2036.499, 711 2036.467 C 747.550 2036.436, 751.359 2036.268, 762 2034.221 C 768.325 2033.005, 777.775 2031.304, 783 2030.441 C 796.309 2028.245, 818.278 2023.640, 840 2018.492 C 888.509 2006.997, 915.230 2000.533, 923 1998.415 C 935.623 1994.972, 956.387 1989.616, 975 1985.001 C 984.075 1982.751, 993.525 1980.301, 996 1979.556 C 998.475 1978.812, 1004.775 1977.234, 1010 1976.049 C 1038.982 1969.480, 1088.414 1957.480, 1101 1953.959 C 1120.181 1948.593, 1152.581 1939.889, 1185 1931.392 C 1193.640 1929.128, 1216.868 1922.171, 1223 1920.011 C 1224.375 1919.527, 1232.250 1917.269, 1240.500 1914.993 C 1257.813 1910.217, 1274.655 1905.100, 1298 1897.521 C 1369.260 1874.385, 1386.675 1868.700, 1410 1860.961 C 1424.575 1856.125, 1443.700 1849.400, 1452.500 1846.016 C 1461.300 1842.632, 1475.475 1837.241, 1484 1834.035 C 1507.291 1825.276, 1512.803 1822.988, 1533.500 1813.487 C 1566.562 1798.311, 1570.612 1796.318, 1578.645 1791.264 C 1582.965 1788.547, 1594.375 1781.656, 1604 1775.951 C 1686.566 1727.013, 1755.876 1662.265, 1810.034 1583.477 C 1851.348 1523.374, 1882.944 1453.858, 1898.881 1388 C 1918.665 1306.243, 1918.658 1230.012, 1898.860 1156.500 C 1877.947 1078.850, 1832.262 1010.018, 1771.500 964.609 C 1766.550 960.910, 1761.181 956.874, 1759.569 955.639 L 1756.639 953.395 1770.401 931.457 C 1786.535 905.738, 1799.100 880.881, 1805.510 862 C 1815.120 833.696, 1822.294 799.469, 1826.685 760.977 C 1829.086 739.926, 1829.078 696.801, 1826.669 674.500 C 1819.008 603.574, 1793.953 528.893, 1761.845 481.275 C 1750.347 464.223, 1743.476 457.372, 1715 434.559 C 1682.485 408.512, 1677.833 405.399, 1634.500 380.695 C 1543.730 328.948, 1525.951 318.656, 1511.259 309.357 C 1502.326 303.703, 1482.301 291.566, 1466.759 282.386 C 1451.216 273.207, 1428.150 259.526, 1415.500 251.986 C 1402.850 244.445, 1384.400 233.650, 1374.500 227.996 C 1336.861 206.501, 1319.883 196.343, 1301 184.020 C 1254.758 153.843, 1198.544 119.500, 1165 100.934 C 1128.592 80.783, 1082.484 57.533, 1062 48.996 C 1055.125 46.130, 1045 41.871, 1039.500 39.530 C 1024.482 33.138, 983.823 20.521, 967.352 17.141 C 947.604 13.090, 936.470 11.870, 916 11.517 C 904.725 11.323, 894.150 11.369, 892.500 11.621 M 349.763 973.565 C 348.257 974.382, 346.823 976.052, 346.576 977.275 C 346.329 978.499, 345.852 997.500, 345.515 1019.500 C 345.177 1041.500, 344.492 1085.375, 343.992 1117 C 343.491 1148.625, 343.073 1190.475, 343.063 1210 C 343.045 1243.561, 343.155 1245.746, 345.075 1250 C 349.176 1259.084, 359.499 1267.153, 384.245 1280.616 C 390.985 1284.283, 406.735 1293.067, 419.245 1300.136 C 444.773 1314.560, 467.548 1326.690, 498.500 1342.346 C 510.050 1348.188, 523.325 1355.049, 528 1357.593 C 595.849 1394.507, 635.664 1414.923, 659.500 1425.020 C 671.548 1430.124, 675.111 1431.213, 691.120 1434.686 C 702.207 1437.091, 705.641 1437.378, 724 1437.436 C 739.083 1437.483, 747.539 1437.024, 756 1435.700 C 762.325 1434.710, 773.350 1432.991, 780.500 1431.879 C 812.554 1426.896, 838.629 1421.126, 879.626 1409.946 C 901.587 1403.957, 905.935 1402.461, 908.374 1400.052 C 910.797 1397.659, 911.856 1394.724, 915.118 1381.357 C 921.830 1353.857, 926.640 1319.352, 929.457 1278.500 C 930.329 1265.850, 931.757 1246.275, 932.629 1235 C 934.427 1211.757, 935.177 1151.745, 933.898 1133.500 C 931.088 1093.435, 930.394 1090, 925.116 1090 C 922.578 1090, 909.194 1093.534, 864.500 1106.005 C 837.817 1113.450, 801.476 1123.134, 796.500 1124.125 C 790.868 1125.246, 773.113 1127.430, 756.168 1129.085 C 731.636 1131.481, 709.750 1126.339, 670.500 1108.956 C 648.782 1099.337, 642.015 1096.216, 616.500 1084.052 C 609.350 1080.643, 598.775 1075.799, 593 1073.288 C 587.225 1070.776, 573.500 1064.460, 562.500 1059.251 C 528.435 1043.119, 480.800 1022.198, 413.540 993.830 C 360.309 971.379, 356.199 970.073, 349.763 973.565"
                                stroke="none" fill="#2c2c2b"></path>
                        </svg>
                    </h2>
                    <h6>We can all do better - For ourselves, and those around us</h6>
                </div>
                <div id="cards">
                    <div id="socials" className="mainSectionCard">
                        <h3>RELEVANT INFORMATION : </h3>
                        <h5>Keep up with us</h5>
                        <hr/>
                        <ul>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="/pdf/Build-the-Bear-White-Paper-v1.pdf"
                                >
                                    ➟ White Paper{" "}
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M5,3H19C20.11,3 21,3.89 21,5V13.03C20.5,12.23 19.81,11.54 19,11V5H5V19H9.5C9.81,19.75 10.26,20.42 10.81,21H5C3.89,21 3,20.11 3,19V5C3,3.89 3.89,3 5,3M7,7H17V9H7V7M7,11H12.03C11.23,11.5 10.54,12.19 10,13H7V11M7,15H9.17C9.06,15.5 9,16 9,16.5V17H7V15Z" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://etherscan.io/token/0xAB8FEfd4CbB4884491053A1d84E7Af17317dA40C"
                                >
                                    ➟ BTB Contract{" "}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        version={"1.0"}
                                        width="294.000000pt"
                                        height="294.000000pt"
                                        viewBox="0 0 294.000000 294.000000"
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        <g
                                            transform="translate(0.000000,294.000000) scale(0.100000,-0.100000)"
                                            fill="#000000"
                                            stroke="none"
                                        >
                                            <path
                                                d="M1301 2930 c-337 -43 -628 -186 -871 -430 -211 -210 -336 -441 -402 -738 -18 -78 -22 -131 -22 -272 -1 -200 15 -310 70 -477 33 -103 112 -273 142 -307 35 -38 88 -56 164 -55 120 1 168 12 200 48 l28 31 0 423 c0 406 1 423 20 455 30 49 72 62 197 62 129 0 170 -10 209 -51 l29 -30 3 -415 c2 -387 4 -415 20 -410 9 3 36 10 59 16 24 6 51 22 62 37 21 25 21 36 21 540 0 562 -1 555 58 598 23 17 46 20 164 23 150 4 182 -4 215 -55 16 -25 18 -71 23 -499 l5 -472 55 23 c66 28 95 55 104 96 3 17 6 281 6 585 l0 554 34 38 34 37 144 3 c161 4 189 -4 224 -61 18 -30 19 -58 22 -484 1 -249 5 -453 8 -453 2 0 48 35 102 77 178 141 370 340 417 432 29 56 17 137 -39 262 -232 522 -732 860 -1296 874 -74 2 -168 0 -209 -5z"/>
                                        </g>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://dexscreener.com/ethereum/0xe708fe7fce0c3fcac741e49a20439d79177753fa"
                                >
                                    ➟ BTB Chart{" "}
                                    <svg width="24px" height="24px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M20 8H18.95L6.95 20H4C2.9 20 2 19.11 2 18C2 16.9 2.9 16 4 16H5.29L7 14.29V10C7 9.45 7.45 9 8 9H9C9.55 9 10 9.45 10 10V11.29L17.29 4H20C21.11 4 22 4.89 22 6C22 7.11 21.11 8 20 8M8.5 5C9.33 5 10 5.67 10 6.5C10 7.33 9.33 8 8.5 8C7.67 8 7 7.33 7 6.5C7 5.67 7.67 5 8.5 5M20.17 15.66L14.66 21.17L12.83 19.34L18.34 13.83L16.5 12H22V17.5L20.17 15.66Z" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.t.me/buildingthebear"
                                >
                                    ➟ Telegram{" "}
                                    <span className="twemoji">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                          <path
                                              d="M2.2 16.06 3.88 12 2.2 7.94l4.06-1.68L7.94 2.2 12 3.88l4.06-1.68 1.68 4.06 4.06 1.68L20.12 12l1.68 4.06-4.06 1.68-1.68 4.06L12 20.12 7.94 21.8l-1.68-4.06-4.06-1.68M13 17v-2h-2v2h2m0-4V7h-2v6h2Z"/>
                                        </svg>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://discord.gg/fyBRthxkyu"
                                >
                                    ➟ Discord{" "}
                                    <span className="twemoji">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-group</title><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" /></svg>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://twitter.com/buildingthebear"
                                >
                                    ➟ Twitter{" "}
                                    <span className="twemoji">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                          <path
                                              d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23Z"/>
                                        </svg>
                                      </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://github.com/buildingthebear"
                                >
                                    ➟ GitHub{" "}
                                    <span className="twemoji">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                          <path
                                              d="M2.6 10.59 8.38 4.8l1.69 1.7c-.24.85.15 1.78.93 2.23v5.54c-.6.34-1 .99-1 1.73a2 2 0 0 0 2 2 2 2 0 0 0 2-2c0-.74-.4-1.39-1-1.73V9.41l2.07 2.09c-.07.15-.07.32-.07.5a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2c-.18 0-.35 0-.5.07L13.93 7.5a1.98 1.98 0 0 0-1.15-2.34c-.43-.16-.88-.2-1.28-.09L9.8 3.38l.79-.78c.78-.79 2.04-.79 2.82 0l7.99 7.99c.79.78.79 2.04 0 2.82l-7.99 7.99c-.78.79-2.04.79-2.82 0L2.6 13.41c-.79-.78-.79-2.04 0-2.82Z"/>
                                        </svg>
                                      </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="mailto:contact@buildthebear.market"
                                >
                                    ➟ E-mail{" "}
                                    <span className="twemoji">
                                        <svg viewBox="0 0 24 24">
                                            <path fill="#000000" d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z"></path>
                                        </svg>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <br/>
                                <span className="mainSectionCardDescription"> Got questions? Shoot us a message on telegram, twitter, or via e-mail</span>
                            </li>
                        </ul>
                    </div>
                    <div id="aboutUs" className="mainSectionCard">
                        <h3>Frequently asked questions : </h3>
                        <h5>Not that you asked</h5>
                        <hr/>
                        <ul>
                            <li>
                                <h6> ╙ What's the goal here?</h6>
                                <span className="mainSectionCardDescription">Build the Bear is focused on improving the quality of DeFi projects and participants through education, support, and an easy-to-use tooling ecosystem</span>
                                <br/>
                                <h6> ╙ How are we getting there?</h6>
                                <span className="mainSectionCardDescription">By bringing current and future builders together to bridge the gap; learning & growing with incentivized, open-source contribution</span>
                                <br/>
                                <h6> ╙ Who can participate?</h6>
                                <span className="mainSectionCardDescription">Everyone! Build the Bear is completely open-source. If you're interested in something, check its README for contribution requirements</span>
                            </li>
                        </ul>
                    </div>
                    <div id="roadmap" className="mainSectionCard">
                        <h3>Build the Bear's Roadmap : </h3>
                        <h5>Upcoming Developments</h5>
                        <hr/>
                        <div className="tabSet">
                            <button className="tabLink">Q4 '22</button>
                            <button className="defaultTab tabLink active">Q1 '23</button>
                            <button className="tabLink">Q2 '23</button>
                            <button className="tabLink">Q3 '23</button>
                        </div>
                        <div id="Q422" className="tabContent">
                            <ul>
                                <li>- Website / Socials ✓</li>
                                <li>- Digital Sticker Pack ✓</li>
                                <li>- Documentation v1 ✓</li>
                                <li>- Contract Peer Review ✓</li>
                                <li>- Private Pre-Sale ✓</li>
                                <li>- Henry Alpha ✓</li>
                            </ul>
                        </div>
                        <div id="Q123" className="tabContent">
                            <ul>
                                <li>- Public Token Offering ✓</li>
                                <li>- Early Adopters NFTs ✓</li>
                                <li>- Staking Pools ✓</li>
                                <li>- Weekly Spotlights ✓</li>
                                <li>- Flooring Experts</li>
                                <li>- Henry Beta</li>
                            </ul>
                        </div>
                        <div id="Q223" className="tabContent">
                            <ul>
                                <li>- Open-Source Participation</li>
                                <li>- Conversion Tools</li>
                                <li>- Documentation v2</li>
                                <li>- Token Tossup</li>
                                <li>- Proof-of-Posts / KYD</li>
                                <li>- Henry the Hypemachine v1</li>
                            </ul>
                        </div>
                        <div id="Q323" className="tabContent">
                            <ul>
                                <li>- BTB PFP</li>
                                <li>- HodlWare</li>
                                <li>- Lego Sets</li>
                                <li>- Bug Bounty Program</li>
                                <li>- Physical Sticker Pack</li>
                                <li>- Building and building and</li>
                            </ul>
                        </div>
                        <br/>
                        <span className="mainSectionCardDescription"> Long-term roadmap items and more listed on the last page of our white paper</span>
                        <br/><br/>
                    </div>
                    <div id="documentation" className="mainSectionCard">
                        <a className="" target="_blank" rel="noreferrer" href="https://www.buildthebear.online/">
                            <h3>➟ Resources & Documentation : </h3>
                        </a>
                        <h5>Build the Bear . Online</h5>
                        <hr/>
                        <ul>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.buildthebear.online/docs/launch"
                                >
                                    ➟ Token Launch Guide{" "}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>file-document-arrow-right-outline</title><path d="M23 19L20 16V18H16V20H20V22L23 19M13.8 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14L20 8V13.1C19.7 13 19.3 13 19 13S18.3 13 18 13.1V9H13V4H6V20H13.1C13.2 20.7 13.5 21.4 13.8 22M8 12H16V13.8C15.9 13.9 15.8 13.9 15.7 14H8V12M8 16H13V18H8V16Z" /></svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.buildthebear.online/docs/analysis"
                                >
                                    ➟ Token Analysis Guide{" "}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>file-document-check-outline</title><path d="M23.5 17L18.5 22L15 18.5L16.5 17L18.5 19L22 15.5L23.5 17M6 2C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.45 21.38 13.2 20.7 13.08 20H6V4H13V9H18V13.08C18.33 13.03 18.67 13 19 13C19.34 13 19.67 13.03 20 13.08V8L14 2M8 12V14H16V12M8 16V18H13V16Z" /></svg>
                                </a>
                            </li>
                            <br />
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.buildthebear.online/docs/minting"
                                >
                                    ➟ How to Mint NFTs{" "}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>file-document-edit-outline</title><path d="M8,12H16V14H8V12M10,20H6V4H13V9H18V12.1L20,10.1V8L14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H10V20M8,18H12.1L13,17.1V16H8V18M20.2,13C20.3,13 20.5,13.1 20.6,13.2L21.9,14.5C22.1,14.7 22.1,15.1 21.9,15.3L20.9,16.3L18.8,14.2L19.8,13.2C19.9,13.1 20,13 20.2,13M20.2,16.9L14.1,23H12V20.9L18.1,14.8L20.2,16.9Z" /></svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.buildthebear.online/docs/deploying"
                                >
                                    ➟ How to Deploy Contracts{" "}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>file-document-alert-outline</title><path d="M20 17H22V15H20V17M20 7V13H22V7M6 16H11V18H6M6 12H14V14H6M4 2C2.89 2 2 2.89 2 4V20C2 21.11 2.89 22 4 22H16C17.11 22 18 21.11 18 20V8L12 2M4 4H11V9H16V20H4Z" /></svg>
                                </a>
                            </li>
                            <li>
                                <br/>
                                <span className="mainSectionCardDescription"> Guides provided are meant to be
                                    high-level direction for builders (and hodlers) who may need advice</span>
                                <br/><br/>
                                <b>More Coming Soon 🏗️</b>
                            </li>
                        </ul>
                    </div>
                    <div id="earlyAdopters" className="mainSectionCard">
                        <div>
                            <a
                                className=""
                                target="_blank"
                                rel="noreferrer"
                                href="https://opensea.io/collection/build-the-bear-early-adopters"
                            >
                                <h3>➟ Early Adopters NFT Collection : </h3>
                            </a>
                            <h5>22 1-of-1 animations from the developer</h5>
                            <hr/>
                            <ul>
                                <li><b>- Cost 0.1Ξ to mint</b></li>
                                <li>- Custom Collectibles</li>
                                <li>- Early Access to Developments</li>
                                <li>- Additional 25% Base Staking Reward</li>
                                <li>- Inclusive of all future benefits</li>
                                <li>
                                    <br/>
                                    <span className="mainSectionCardDescription">Earn your place in BtB history with unique proof of your support! Minting is now available to the public</span>
                                    <br/><br/>
                                    <a
                                        className=""
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://app.niftykit.com/drops/buildthebear-v1"
                                    >
                                        <b>➟ Secure your mint{" "}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>hand-coin</title><path d="M16 12C18.76 12 21 9.76 21 7S18.76 2 16 2 11 4.24 11 7 13.24 12 16 12M21.45 17.6C21.06 17.2 20.57 17 20 17H13L10.92 16.27L11.25 15.33L13 16H15.8C16.15 16 16.43 15.86 16.66 15.63S17 15.12 17 14.81C17 14.27 16.74 13.9 16.22 13.69L8.95 11H7V20L14 22L22.03 19C22.04 18.47 21.84 18 21.45 17.6M5 11H.984V22H5V11Z" /></svg>
                                        </b>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className=""
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://opensea.io/collection/build-the-bear-early-adopters"
                                    >
                                        ➟ View on OpenSea{" "}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>ferry</title><path d="M6,6H18V9.96L12,8L6,9.96M3.94,19H4C5.6,19 7,18.12 8,17C9,18.12 10.4,19 12,19C13.6,19 15,18.12 16,17C17,18.12 18.4,19 20,19H20.05L21.95,12.31C22.03,12.06 22,11.78 21.89,11.54C21.76,11.3 21.55,11.12 21.29,11.04L20,10.62V6C20,4.89 19.1,4 18,4H15V1H9V4H6A2,2 0 0,0 4,6V10.62L2.71,11.04C2.45,11.12 2.24,11.3 2.11,11.54C2,11.78 1.97,12.06 2.05,12.31M20,21C18.61,21 17.22,20.53 16,19.67C13.56,21.38 10.44,21.38 8,19.67C6.78,20.53 5.39,21 4,21H2V23H4C5.37,23 6.74,22.65 8,22C10.5,23.3 13.5,23.3 16,22C17.26,22.65 18.62,23 20,23H22V21H20Z" /></svg>
                                    </a>
                                </li>
                            </ul>
                            <video id="earlyAdoptersVideo" width="64" height="64" playsInline={true} autoPlay={true} controls={false} muted={true} loop={true}>
                                <source src="/video/early-adopters-sample.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                    </div>
                    <div id="swapWidget" className="mainSectionCard">
                        <SwapWidget
                            jsonRpcEndpoint={process.env.JSON_RPC_URL}
                            tokenList={TOKEN_LIST}
                            provider={pr}
                            locale={'en-US'}
                            onConnectWallet={focusConnectors}
                            defaultInputTokenAddress="NATIVE"
                            defaultInputAmount="0.1"
                            defaultOutputTokenAddress={BTB}
                            className={"swapWidget"}
                            width={400}
                            theme={theme}
                        />
                    </div>
                    <div id="singleStakingWidget" className="mainSectionCard" ref={singleStaking}>
                        <StakingComponent/>
                    </div>
                    <div className="transaction-overlay hidden background">
                        <div className="transaction-container">
                            <div className="transaction-header">
                                <h2>Transaction in progress</h2>
                                <div className="transaction-spinner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Script src="https://code.jquery.com/jquery-3.6.1.min.js"></Script>
            <Script src="/js/index.jsx"></Script>
        </div>
    )
}

export default Home
