(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/leaflet-map.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeafletMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Marker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2d$rankings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase-rankings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bay$2d$area$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/bay-area.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pastel$2d$cups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pastel-cups.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
// Fix for Leaflet default icons in Next.js
delete __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.prototype._getIconUrl;
function getPinTint(rank) {
    const tints = [
        "hue-rotate(-18deg) saturate(0.85) brightness(1.08)",
        "hue-rotate(-6deg) saturate(0.9) brightness(1.08)",
        "hue-rotate(8deg) saturate(0.9) brightness(1.08)",
        "hue-rotate(20deg) saturate(0.85) brightness(1.08)",
        "hue-rotate(48deg) saturate(0.9) brightness(1.05)",
        "hue-rotate(88deg) saturate(0.9) brightness(1.04)",
        "hue-rotate(130deg) saturate(0.95) brightness(1.03)",
        "hue-rotate(154deg) saturate(0.95) brightness(1.04)",
        "hue-rotate(174deg) saturate(0.95) brightness(1.05)"
    ];
    return tints[(Math.max(rank, 1) - 1) % tints.length];
}
function getTintForPastelColor(color) {
    const tintMap = {
        "#FFE5EC": "hue-rotate(-18deg) saturate(0.85) brightness(1.08)",
        "#FDE2E4": "hue-rotate(-6deg) saturate(0.9) brightness(1.08)",
        "#FEECD2": "hue-rotate(8deg) saturate(0.9) brightness(1.08)",
        "#FFF1B6": "hue-rotate(20deg) saturate(0.85) brightness(1.08)",
        "#DFF7E2": "hue-rotate(48deg) saturate(0.9) brightness(1.05)",
        "#D9F2FF": "hue-rotate(88deg) saturate(0.9) brightness(1.04)",
        "#E3E0FF": "hue-rotate(130deg) saturate(0.95) brightness(1.03)",
        "#F0E4FF": "hue-rotate(154deg) saturate(0.95) brightness(1.04)",
        "#FFDFF5": "hue-rotate(174deg) saturate(0.95) brightness(1.05)"
    };
    return tintMap[color] ?? "hue-rotate(24deg) saturate(0.9) brightness(1.06)";
}
function getPastelPinIcon(tint) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
        className: "matcha-pin-div",
        html: `<img src="/matcha.svg" alt="" style="width:46px;height:46px;filter:${tint} drop-shadow(0 2px 3px rgba(0,0,0,0.25));" />`,
        iconSize: [
            46,
            46
        ],
        iconAnchor: [
            23,
            40
        ],
        popupAnchor: [
            0,
            -34
        ]
    });
}
function MapPopupContent({ spotName, onOpenDetails }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onOpenDetails,
            className: "text-left",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[12px] font-bold leading-snug text-primary",
                children: spotName
            }, void 0, false, {
                fileName: "[project]/components/leaflet-map.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/leaflet-map.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/leaflet-map.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c = MapPopupContent;
function MapBoundsController({ bayAreaBounds }) {
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapBoundsController.useEffect": ()=>{
            const bounds = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLngBounds(bayAreaBounds);
            map.setMaxBounds(bounds.pad(0.08));
            if (!initialized.current) {
                map.fitBounds(bounds, {
                    padding: [
                        18,
                        18
                    ]
                });
                initialized.current = true;
            }
        }
    }["MapBoundsController.useEffect"], [
        map,
        bayAreaBounds
    ]);
    return null;
}
_s(MapBoundsController, "qlz6olvaJ0SOzege3Z0txLy0Av4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c1 = MapBoundsController;
function MapSelectionController({ selectedSpot, markerRefs, spotsLength }) {
    _s1();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapSelectionController.useEffect": ()=>{
            if (selectedSpot == null) return;
            const marker = markerRefs.current[selectedSpot];
            if (!marker) return;
            marker.openPopup();
            map.panTo(marker.getLatLng(), {
                animate: true
            });
        }
    }["MapSelectionController.useEffect"], [
        map,
        markerRefs,
        selectedSpot,
        spotsLength
    ]);
    return null;
}
_s1(MapSelectionController, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c2 = MapSelectionController;
function LeafletMap({ selectedSpot, onSpotClick, displayMode, uid, searchRankings = [] }) {
    _s2();
    const [myRankings, setMyRankings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [globalTop10, setGlobalTop10] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [myCupColors, setMyCupColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [detailsOpen, setDetailsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeSpot, setActiveSpot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const markerRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // Subscribe to user's rankings when in "my" mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeafletMap.useEffect": ()=>{
            if (displayMode === "my" && uid) {
                const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2d$rankings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeMyRankings"])(uid, {
                    "LeafletMap.useEffect.unsubscribe": (rankings)=>{
                        setMyRankings(rankings);
                    }
                }["LeafletMap.useEffect.unsubscribe"]);
                return ({
                    "LeafletMap.useEffect": ()=>unsubscribe()
                })["LeafletMap.useEffect"];
            } else {
                setMyRankings([]);
            }
        }
    }["LeafletMap.useEffect"], [
        displayMode,
        uid
    ]);
    // Load global top 10 when in "global" mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeafletMap.useEffect": ()=>{
            if (displayMode === "global") {
                setLoading(true);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2d$rankings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGlobalTop10"])().then({
                    "LeafletMap.useEffect": (spots)=>{
                        setGlobalTop10(spots);
                    }
                }["LeafletMap.useEffect"]).catch({
                    "LeafletMap.useEffect": (err)=>{
                        console.error("Failed to load global top 10:", err);
                        setGlobalTop10([]);
                    }
                }["LeafletMap.useEffect"]).finally({
                    "LeafletMap.useEffect": ()=>setLoading(false)
                }["LeafletMap.useEffect"]);
            } else {
                setGlobalTop10([]);
            }
        }
    }["LeafletMap.useEffect"], [
        displayMode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeafletMap.useEffect": ()=>{
            if (!uid || displayMode !== "my") return;
            const keys = myRankings.map({
                "LeafletMap.useEffect.keys": (r)=>r.id
            }["LeafletMap.useEffect.keys"]);
            setMyCupColors((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pastel$2d$cups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrCreateCupColors"])(`mytcha-cups-${uid}`, keys));
        }
    }["LeafletMap.useEffect"], [
        uid,
        displayMode,
        myRankings
    ]);
    // Bay Area center and bounds
    const bayAreaCenter = [
        37.72,
        -122.25
    ];
    const bayAreaBounds = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bay$2d$area$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BAY_AREA_BOUNDS"];
    // Get the spots to display based on mode
    const spotsToDisplay = displayMode === "my" ? myRankings.filter((r)=>r.lat != null && r.lng != null) : displayMode === "global" ? globalTop10.filter((s)=>s.lat != null && s.lng != null) : searchRankings.filter((r)=>r.lat != null && r.lng != null);
    const openSpotDetails = (name, location, rank)=>{
        setActiveSpot({
            name,
            location,
            rank
        });
        setDetailsOpen(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative z-0 h-full min-h-[400px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: bayAreaCenter,
                zoom: 10,
                style: {
                    height: "100%",
                    width: "100%"
                },
                minZoom: 9,
                maxZoom: 16,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapBoundsController, {
                        bayAreaBounds: bayAreaBounds
                    }, void 0, false, {
                        fileName: "[project]/components/leaflet-map.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapSelectionController, {
                        selectedSpot: selectedSpot,
                        markerRefs: markerRefs,
                        spotsLength: spotsToDisplay.length
                    }, void 0, false, {
                        fileName: "[project]/components/leaflet-map.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                        attribution: '© <a href="https://carto.com/about-carto/">CARTO</a>'
                    }, void 0, false, {
                        fileName: "[project]/components/leaflet-map.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950 rounded-lg shadow-lg p-4 flex items-center gap-2 z-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "size-5 animate-spin text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/components/leaflet-map.tsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "Loading..."
                            }, void 0, false, {
                                fileName: "[project]/components/leaflet-map.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/leaflet-map.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    spotsToDisplay.map((spot, index)=>{
                        const lat = spot.lat;
                        const lng = spot.lng;
                        const spotName = spot.name;
                        const spotLocation = spot.location;
                        const spotRank = displayMode === "my" ? spot.ranking : displayMode === "global" ? index + 1 : spot.ranking;
                        const pinTint = displayMode === "my" ? getTintForPastelColor(myCupColors[spot.id] ?? "#FFE5EC") : getPinTint(spotRank);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                            position: [
                                lat,
                                lng
                            ],
                            icon: getPastelPinIcon(pinTint),
                            ref: (marker)=>{
                                markerRefs.current[spotRank] = marker;
                            },
                            eventHandlers: {
                                click: ()=>onSpotClick(spotRank)
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                className: "matcha-popup",
                                minWidth: 180,
                                maxWidth: 240,
                                closeButton: false,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapPopupContent, {
                                    spotName: spotName,
                                    onOpenDetails: ()=>openSpotDetails(spotName, spotLocation, spotRank)
                                }, void 0, false, {
                                    fileName: "[project]/components/leaflet-map.tsx",
                                    lineNumber: 235,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/leaflet-map.tsx",
                                lineNumber: 234,
                                columnNumber: 15
                            }, this)
                        }, `${spotName}-${spotLocation}-${index}`, false, {
                            fileName: "[project]/components/leaflet-map.tsx",
                            lineNumber: 223,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/leaflet-map.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: detailsOpen,
                onOpenChange: setDetailsOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-md rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-[#f6fff3] to-white p-5 shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                className: "text-primary",
                                children: activeSpot ? `#${activeSpot.rank} ${activeSpot.name}` : "Matcha Spot"
                            }, void 0, false, {
                                fileName: "[project]/components/leaflet-map.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/leaflet-map.tsx",
                            lineNumber: 247,
                            columnNumber: 11
                        }, this),
                        activeSpot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground leading-relaxed",
                            children: activeSpot.location
                        }, void 0, false, {
                            fileName: "[project]/components/leaflet-map.tsx",
                            lineNumber: 253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/leaflet-map.tsx",
                    lineNumber: 246,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/leaflet-map.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/leaflet-map.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
_s2(LeafletMap, "hfV+O76TGq/lGd8ma23l6aJ9mN0=");
_c3 = LeafletMap;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "MapPopupContent");
__turbopack_context__.k.register(_c1, "MapBoundsController");
__turbopack_context__.k.register(_c2, "MapSelectionController");
__turbopack_context__.k.register(_c3, "LeafletMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/leaflet-map.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/leaflet-map.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_leaflet-map_tsx_89c6d53a._.js.map