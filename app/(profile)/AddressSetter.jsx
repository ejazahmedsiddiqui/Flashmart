import {SafeAreaView} from "react-native-safe-area-context";
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Animated,
    Platform,
    KeyboardAvoidingView,
    Modal,
    Dimensions
} from "react-native";
import RenderFormField from "../../components/RenderFormField";
import React, {useState, useRef, useEffect} from "react";
import {
    Home,
    LocateFixed,
    CheckCircle2,
    MapPin,
    Navigation,
    Edit3,
    X,
    AlertCircleIcon
} from 'lucide-react-native';
import CustomAlert from "../../components/CustomAlert";
import {useAlert} from "../../utilities/alertConfig";
import SuccessModal from "../../components/SuccessModal";
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import {router} from "expo-router";

const {width, height} = Dimensions.get('window');

const AddressSetter = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [homeAddress, setHomeAddress] = useState({
        doorNumber: '',
        houseName: '',
        street: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
        latitude: null,
        longitude: null,
        formattedAddress: '', // Auto-fetched address
    });

    const [mapRegion, setMapRegion] = useState({
        latitude: 28.6139,
        longitude: 77.2090,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tempAddress, setTempAddress] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    const {showAlert, hideAlert, alertConfig} = useAlert();
    const mapRef = useRef(null);
    const progressAnim = useRef(new Animated.Value(25)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const updateTimerRef = useRef(null);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(progressAnim, {
                toValue: currentStep * 100 / 3,
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    }, [currentStep]);

    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setHasLocationPermission(true);
            }
        })();
    }, []);


    useEffect(() => {
        console.log('@/app/auth/Login -> Registration Page Accessed');

        // Cleanup function
        return () => {
            if (updateTimerRef.current) {
                clearTimeout(updateTimerRef.current);
            }
        };
    }, []);


    const steps = [
        {id: 1, title: "Location", icon: MapPin},
        {id: 2, title: "Address", icon: Home},
        {id: 3, title: "Review", icon: CheckCircle2},
    ];

    const handleNext = () => {
        switch (currentStep) {
            case 1: {
                if (!homeAddress.street || !homeAddress.city || !homeAddress.state || !homeAddress.pinCode) {
                    showAlert('Incomplete Location', 'Please complete your location details');
                    return;
                }
                if (currentStep < 3) {
                    fadeAnim.setValue(0);
                    slideAnim.setValue(50);
                    setCurrentStep(currentStep + 1);
                }
                break;
            }
            case 2: {
                if (!homeAddress.doorNumber || !homeAddress.houseName) {
                    showAlert('Incomplete Address', 'Please enter door number and house name');
                    return;
                }
                if (currentStep < 3) {
                    fadeAnim.setValue(0);
                    slideAnim.setValue(50);
                    setCurrentStep(currentStep + 1);
                }
                break;
            }
            default: {
                if (currentStep < 3) {
                    setCurrentStep(currentStep + 1);
                }
                break;
            }
        }
    };

    const fetchLocation = async () => {
        try {
            setIsFetchingLocation(true);

            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showAlert('Permission Denied', 'Location permission is required');
                setHasLocationPermission(false);
                return;
            }

            setHasLocationPermission(true);

            const location = await Location.getCurrentPositionAsync({});
            const [place] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (!place) return;

            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };

            // Only animate the map, don't set state directly
            // The onRegionChangeComplete will handle the state update
            if (mapRef.current) {
                mapRef.current.animateToRegion(newRegion, 1000);
            }

            // Update address immediately for auto-fetch
            setHomeAddress(prev => ({
                ...prev,
                street: place.street || place.name,
                city: place.city || place.subregion || '',
                district: place.district || '',
                state: place.region || '',
                pinCode: place.postalCode || '',
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                formattedAddress: place.formattedAddress || '',
            }));

        } catch (error) {
            console.error('Location fetch error:', error);
            showAlert('Location Error', 'Unable to fetch location');
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const updateAddressFromPin = async (lat, lng) => {
        // Only proceed if we have location permissions
        if (!hasLocationPermission) {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            setHasLocationPermission(true);
        }


        try {
            const [place] = await Location.reverseGeocodeAsync({latitude: lat, longitude: lng});
            if (!place) return;

            console.log('Place value is : ', place)

            setHomeAddress(prev => ({
                ...prev,
                street: place.street || place.name,
                city: place.city || place.subregion || '',
                district: place.district || '',
                state: place.region || '',
                pinCode: place.postalCode || '',
                latitude: lat,
                longitude: lng,
                formattedAddress: place.formattedAddress || '',
            }));
        } catch (error) {
            // Silently handle permission errors during map drag
            if (error.message && error.message.includes('Not authorized')) {
                setHasLocationPermission(false);
            } else {
                console.error('Error updating address from pin:', error);
            }
        }
    };

    const handleEditAddress = () => {
        setTempAddress({
            street: homeAddress.street,
            city: homeAddress.city,
            pinCode: homeAddress.pinCode,
        });
        setShowEditModal(true);
    };

    const saveEditedAddress = async () => {
        setHomeAddress(prev => ({
            ...prev,
            street: tempAddress.street,
            city: tempAddress.city,
            pinCode: tempAddress.pinCode,
        }));

        // Try to update map location based on edited address
        try {
            const query = `${tempAddress.street}, ${tempAddress.city}, ${tempAddress.pinCode}`;
            const results = await Location.geocodeAsync(query);

            if (results && results.length > 0) {
                const {latitude, longitude} = results[0];
                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };

                setMapRegion(newRegion);
                if (mapRef.current) {
                    mapRef.current.animateToRegion(newRegion, 500);
                }

                setHomeAddress(prev => ({
                    ...prev,
                    latitude,
                    longitude,
                }));
            }
        } catch (error) {
            console.log('Could not geocode address:', error);
        }

        setShowEditModal(false);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
            setCurrentStep(currentStep - 1);
        }
        if (currentStep === 1)
            router.back();
    };

    const handleSubmit = () => {
        console.log("Form submitted");
        setShowSuccessModal(true);
    };

    const buildFullUserAddress = () => {
        return [
            homeAddress.doorNumber,
            homeAddress.houseName,
            homeAddress.street,
            homeAddress.city,
            homeAddress.district,
            homeAddress.state,
            homeAddress.pinCode,
        ]
            .filter(Boolean)
            .join(', ');
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicatorContainer}>
            <View style={styles.progressBarBackground}>
                <Animated.View
                    style={[
                        styles.progressBarFill,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%']
                            })
                        }
                    ]}
                />
            </View>
            <View style={styles.stepsContainer}>
                {steps.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <View key={step.id} style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                isActive && styles.stepCircleActive,
                                isCompleted && styles.stepCircleCompleted
                            ]}>
                                <StepIcon
                                    size={16}
                                    color={isActive || isCompleted ? "#fff" : "#9CA3AF"}
                                />
                            </View>
                            <Text style={[
                                styles.stepLabel,
                                isActive && styles.stepLabelActive
                            ]}>
                                {step.title}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );

    const renderLocationSelection = () => (
            <Animated.View
                style={[
                    styles.formSection,
                    {
                        opacity: fadeAnim,
                        transform: [{translateY: slideAnim}]
                    }
                ]}
            >
                <Text style={styles.sectionTitle}>Pin Your Location</Text>
                <Text style={styles.sectionSubtitle}>
                    Move the map to adjust the pin to your exact location
                </Text>

                {/* Auto Fetch Button */}
                <TouchableOpacity
                    style={styles.autoFetchButton}
                    onPress={fetchLocation}
                    disabled={isFetchingLocation}
                >
                    <Navigation size={20} color="#fff"/>
                    <Text style={styles.autoFetchButtonText}>
                        {isFetchingLocation ? 'Locating...' : 'Auto Fetch Location'}
                    </Text>
                </TouchableOpacity>

                {/* Permission Info */}
                {!hasLocationPermission && (
                    <View style={styles.permissionInfo}>
                        <LocateFixed size={16} color="#F59E0B"/>
                        <Text style={styles.permissionInfoText}>
                            Tap &#34;Auto Fetch Location&#34; to enable map address updates
                        </Text>
                    </View>
                )}

                {/* Map Container */}
                <View style={styles.mapWrapper}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={mapRegion}
                        onRegionChangeComplete={(region) => {
                            // Only update if map is ready and we have permissions
                            if (isMapReady && hasLocationPermission) {
                                // Clear any existing timer
                                if (updateTimerRef.current) {
                                    clearTimeout(updateTimerRef.current);
                                }

                                // Update the map region state
                                setMapRegion(region);

                                // Debounce the address update by 1 second
                                updateTimerRef.current = setTimeout(() => {
                                    updateAddressFromPin(region.latitude, region.longitude);
                                }, 1000);
                            }
                        }}
                        onMapReady={() => setIsMapReady(true)}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        moveOnMarkerPress={false}
                        loadingEnabled={true}
                        loadingIndicatorColor="#93BD57"
                        pitchEnabled={false}
                        rotateEnabled={false}
                    />
                    {/* Center Pin Indicator */}
                    <View style={styles.centerPinContainer} pointerEvents="none">
                        <MapPin size={40} color="#E11D48" fill="#E11D48"/>
                        <View style={styles.pinShadow}/>
                    </View>
                </View>

                {/* Location Details Card */}
                {(homeAddress.street || homeAddress.city) && (
                    <>
                        <View style={styles.locationCard}>
                            <View style={styles.locationHeader}>
                                <MapPin size={18} color="#93BD57"/>
                                <Text style={styles.locationTitle}>Selected Location</Text>
                            </View>

                            <View style={styles.locationDetails}>
                                {homeAddress.street ?
                                    <Text style={styles.locationText}>{homeAddress.street}</Text> :
                                    (
                                        <View>
                                            <AlertCircleIcon size={20} color={'red'}/>
                                            <Text style={{color: '#a31616', marginBottom: 12,}}>Street Name not Found.
                                                Kindly Edit and
                                                Add</Text>
                                        </View>
                                    )
                                }
                                <Text style={styles.locationSubtext}>
                                    {homeAddress.city}, {homeAddress.state} {homeAddress.pinCode}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditAddress}
                            >
                                <Edit3 size={16} color="#93BD57"/>
                                <Text style={styles.editButtonText}>Edit Details</Text>
                            </TouchableOpacity>
                        </View>
                        {(homeAddress.street || homeAddress.city) && <View style={[styles.locationCard, {marginTop: 12,}]}>
                            <View style={styles.locationHeader}>
                                <MapPin size={18} color="#93BD57"/>
                                <Text style={styles.locationTitle}>Auto-Fetch Location Details: </Text>
                            </View>

                            <View style={styles.locationDetails}>
                                <Text style={styles.locationText}>{homeAddress.formattedAddress}</Text>
                            </View>

                        </View>}
                    </>
                )}

                {
                    !homeAddress.formattedAddress && (
                        <View style={styles.emptyLocationCard}>
                            <LocateFixed size={32} color="#D1D5DB"/>
                            <Text style={styles.emptyLocationText}>
                                Use Auto Fetch or move the map to select your location
                            </Text>
                        </View>
                    )
                }
            </Animated.View>
        )
    ;

    const renderHouseDetails = () => (
        <Animated.View
            style={[
                styles.formSection,
                {
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}]
                }
            ]}
        >
            <Text style={styles.sectionTitle}>Complete Your Address</Text>
            <Text style={styles.sectionSubtitle}>
                Add your door number and house/building name
            </Text>

            <View style={styles.fieldsContainer}>
                <RenderFormField
                    maxLength={20}
                    label="Door Number"
                    value={homeAddress.doorNumber}
                    onChangeText={(value) => setHomeAddress(prev => ({...prev, doorNumber: value}))}
                    placeholder="e.g., 42, A-101"
                    icon={<Home size={20} color="#9CA3AF"/>}
                />

                <RenderFormField
                    maxLength={50}
                    label="House/Building Name"
                    value={homeAddress.houseName}
                    onChangeText={(value) => setHomeAddress(prev => ({...prev, houseName: value}))}
                    placeholder="e.g., Green Valley Apartments"
                    autoCapitalize="words"
                    icon={<Home size={20} color="#9CA3AF"/>}
                />
            </View>

            {/* Address Preview */}
            <View style={styles.previewCard}>
                <Text style={styles.previewLabel}>Your Complete Address</Text>
                <Text style={styles.previewAddress}>{buildFullUserAddress()}</Text>
            </View>
        </Animated.View>
    );

    const renderReview = () => (
        <Animated.View
            style={[
                styles.formSection,
                {
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}]
                }
            ]}
        >
            <Text style={styles.sectionTitle}>Review Your Details</Text>
            <Text style={styles.sectionSubtitle}>
                Please verify all information before submitting
            </Text>

            <View style={styles.reviewContainer}>

                {/* Address Information */}
                <View style={styles.reviewSection}>
                    <Text style={styles.reviewSectionTitle}>Address Details</Text>
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewLabel}>Complete Address</Text>
                        <Text style={styles.reviewValue}>{buildFullUserAddress()}</Text>
                    </View>
                    {homeAddress.formattedAddress && (
                        <View style={styles.reviewItem}>
                            <Text style={styles.reviewLabel}>Auto-Fetched Address</Text>
                            <Text style={styles.reviewValue}>{homeAddress.formattedAddress}</Text>
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );

    const renderEditModal = () => (
        <Modal
            visible={showEditModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowEditModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Edit Location Details</Text>
                        <TouchableOpacity onPress={() => setShowEditModal(false)}>
                            <X size={24} color="#6B7280"/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalBody}>
                        <RenderFormField
                            label="Street Address"
                            value={tempAddress.street}
                            onChangeText={(value) => setTempAddress(prev => ({...prev, street: value}))}
                            placeholder="Enter street address"
                        />

                        <RenderFormField
                            label="City"
                            value={tempAddress.city}
                            onChangeText={(value) => setTempAddress(prev => ({...prev, city: value}))}
                            placeholder="Enter city"
                        />

                        <RenderFormField
                            label="Pin Code"
                            value={tempAddress.pinCode}
                            onChangeText={(value) => setTempAddress(prev => ({...prev, pinCode: value}))}
                            placeholder="Enter pin code"
                            inputType="numeric"
                            maxLength={6}
                        />
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setShowEditModal(false)}
                        >
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalSaveButton}
                            onPress={saveEditedAddress}
                        >
                            <Text style={styles.modalSaveText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconWrapper}>
                            <Home size={36} color="#fff"/>
                        </View>
                        <Text style={styles.headerTitle}>Set Address</Text>
                        <Text style={styles.headerSubtitle}>
                            Add your delivery address/location
                        </Text>
                    </View>

                    {/* Step Indicator */}
                    {renderStepIndicator()}

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        {/*{currentStep === 1 && renderPersonalInfo()}*/}
                        {currentStep === 1 && renderLocationSelection()}
                        {currentStep === 2 && renderHouseDetails()}
                        {currentStep === 3 && renderReview()}
                    </View>

                    {/* Navigation Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                currentStep === 1 && styles.nextButtonFull
                            ]}
                            onPress={currentStep === 3 ? handleSubmit : handleNext}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentStep === 3 ? 'Submit' : 'Continue'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Edit Modal */}
            {renderEditModal()}

            {/* Alert */}
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={hideAlert}
            />

            {/* Success Modal */}
            <SuccessModal
                title={'Address addressed'}
                subtitle={'New location added Successfully, Redirecting to Addresses'}
                onAnimationComplete={() => {
                    setShowSuccessModal(false);
                    router.push('/')
                }}
                iconColor={'#93BD57'}
                iconBackgroundColor={'#D4E7B8'}
                progressBarColor={'#93BD57'}
                visible={showSuccessModal}
                autoCloseDuration={1200}
            />
        </SafeAreaView>
    );
};

export default AddressSetter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 8,
    },
    iconWrapper: {
        width: 72,
        height: 72,
        backgroundColor: '#93BD57',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#93BD57',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    headerTitle: {
        fontFamily: 'Montserrat',
        fontSize: 26,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '400',
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    stepIndicatorContainer: {
        marginBottom: 24,
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#93BD57',
        borderRadius: 2,
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepItem: {
        alignItems: 'center',
        flex: 1,
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepCircleActive: {
        backgroundColor: '#93BD57',
        shadowColor: '#93BD57',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    stepCircleCompleted: {
        backgroundColor: '#059669',
    },
    stepLabel: {
        fontFamily: 'Montserrat',
        fontSize: 11,
        fontWeight: '500',
        color: '#94A3B8',
        textAlign: 'center',
    },
    stepLabelActive: {
        color: '#93BD57',
        fontWeight: '600',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
    },
    formSection: {
        width: '100%',
    },
    sectionTitle: {
        fontFamily: 'Montserrat',
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    sectionSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '400',
        color: '#64748B',
        marginBottom: 24,
        lineHeight: 20,
    },
    fieldsContainer: {
        gap: 16,
    },
    autoFetchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#059669',
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 20,
        shadowColor: '#059669',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    autoFetchButtonText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },
    permissionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FEF3C7',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    permissionInfoText: {
        flex: 1,
        fontFamily: 'Montserrat',
        fontSize: 12,
        fontWeight: '500',
        color: '#92400E',
        lineHeight: 16,
    },
    mapWrapper: {
        height: 320,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#E2E8F0', // Prevent flash during load
    },
    map: {
        width: '100%',
        height: '100%',
    },
    centerPinContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
        alignItems: 'center',
    },
    pinShadow: {
        width: 16,
        height: 6,
        backgroundColor: '#000',
        opacity: 0.2,
        borderRadius: 8,
        marginTop: 2,
    },
    locationCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    locationTitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    locationDetails: {
        marginBottom: 12,
    },
    locationText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 4,
    },
    locationSubtext: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        fontWeight: '400',
        color: '#64748B',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#93BD57',
    },
    editButtonText: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        fontWeight: '600',
        color: '#93BD57',
    },
    emptyLocationCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    emptyLocationText: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 12,
        maxWidth: 240,
    },
    previewCard: {
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    previewLabel: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        fontWeight: '600',
        color: '#1E40AF',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    previewAddress: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '500',
        color: '#1E3A8A',
        lineHeight: 20,
    },
    reviewContainer: {
        gap: 16,
    },
    reviewSection: {
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    reviewSectionTitle: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 12,
    },
    reviewItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    reviewLabel: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },
    reviewValue: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '500',
        color: '#0F172A',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    backButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    backButtonText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    nextButton: {
        flex: 1,
        backgroundColor: '#93BD57',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#93BD57',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    nextButtonFull: {
        flex: 1,
    },
    nextButtonText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 32,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalBody: {
        gap: 16,
        marginBottom: 24,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalCancelText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    modalSaveButton: {
        flex: 1,
        backgroundColor: '#93BD57',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalSaveText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
});