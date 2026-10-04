package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.exception.VendorProfileAlreadyExistsException;
import io.github.trip.shiv.dailydabba.web.business.exception.VendorProfileNotFoundException;
import io.github.trip.shiv.dailydabba.web.business.request.vendor.CreateVendorRequest;
import io.github.trip.shiv.dailydabba.web.business.request.vendor.UpdateVendorRequest;
import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.VendorVerificationStatus;
import io.github.trip.shiv.dailydabba.web.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class VendorServiceImpl implements VendorService {

    private final  VendorProfileRepository vendorProfileRepository;

    private final UserService userService;

    @Override
    @Transactional
    public VendorProfile createVendor(UUID userId, CreateVendorRequest request) {
        //Load the User first
        User user = userService.getUserById(userId);

        //Check that the User must not create More than One Profile
        if (vendorProfileRepository.existsByUserId(userId)) {
            throw new VendorProfileAlreadyExistsException(
                    "Vendor profile already exists for user " + userId
            );
        }

        VendorProfile vendor = request.toEntity();
        vendor.setUser(user);

        return  vendorProfileRepository.save(vendor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendorProfile getVendorById(UUID vendorId) {
        return vendorProfileRepository.findById(vendorId).orElseThrow(
                () -> new VendorProfileNotFoundException("Vendor Profile with id " + vendorId + " not found")
        );
    }

    @Override
    @Transactional(readOnly = true)
    public VendorProfile getVendorByUserId(UUID userId) {
        return vendorProfileRepository.findByUserId(userId).orElseThrow(
                () -> new VendorProfileNotFoundException("Vendor Profile with userId " + userId + " not found")
        );
    }

    @Override
    @Transactional
    public VendorProfile updateVendor(UUID vendorId, UpdateVendorRequest request) {
        VendorProfile vendorProfile = getVendorById(vendorId);
        request.applyOn(vendorProfile);
        return vendorProfile;
    }

    @Override
    @Transactional
    public void deleteVendor(UUID vendorId) {
        VendorProfile vendorProfile = getVendorById(vendorId);
        vendorProfileRepository.delete(vendorProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUserId(UUID userId) {
        return vendorProfileRepository.existsByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendorProfile> getVendorsByVerificationStatus(VendorVerificationStatus status) {
        return vendorProfileRepository.findByVerificationStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendorProfile> getAcceptingVendors(Pageable pageable) {
        return vendorProfileRepository
                .findByAcceptingOrdersTrueAndVerificationStatus(
                        VendorVerificationStatus.VERIFIED,pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendorProfile> searchVendorsByName(String name, Pageable pageable) {
        return vendorProfileRepository
                .findByBusinessNameContainingIgnoreCaseAndAcceptingOrdersTrueAndVerificationStatus(
                        name,
                        VendorVerificationStatus.VERIFIED,
                        pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendorProfile> getTopRatedVendors(Pageable pageable) {
        return vendorProfileRepository
                .findTopRatedVendors(VendorVerificationStatus.VERIFIED,pageable);
    }

    @Override
    @Transactional
    public VendorProfile updateVerificationStatus(UUID vendorId, VendorVerificationStatus status) {
        VendorProfile vendorProfile = getVendorById(vendorId);
        vendorProfile.setVerificationStatus(status);
        return vendorProfile;
    }

    @Override
    @Transactional
    public VendorProfile updateAcceptingOrders(UUID vendorId, boolean acceptingOrders) {
        VendorProfile vendorProfile = getVendorById(vendorId);
        vendorProfile.setAcceptingOrders(acceptingOrders);
        return  vendorProfile;
    }
}
