package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.User.AddressDto;
import com.cs308_team_3.sabanci_pharmacy.entity.Address;
import com.cs308_team_3.sabanci_pharmacy.entity.User;
import com.cs308_team_3.sabanci_pharmacy.repository.AddressRepository;
import com.cs308_team_3.sabanci_pharmacy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AddressDto> getUserAddresses(Integer userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(Integer userId, AddressDto addressDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If this is the first address, make it default automatically
        boolean isFirstAddress = addressRepository.findByUserId(userId).isEmpty();

        Address address = new Address();
        address.setUser(user);
        address.setAddressLine(addressDto.getAddressLine());
        address.setCity(addressDto.getCity());
        address.setProvince(addressDto.getProvince());
        address.setZipCode(addressDto.getZipCode());
        address.setPhone(addressDto.getPhone());
        address.setIsDefault(isFirstAddress || Boolean.TRUE.equals(addressDto.getIsDefault()));

        // If setting as default, unset others
        if (address.getIsDefault()) {
            unsetOtherDefaults(userId);
        }

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteAddress(Integer addressId) {
        addressRepository.deleteById(addressId);
    }

    private void unsetOtherDefaults(Integer userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address addr : addresses) {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    private AddressDto mapToDto(Address address) {
        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setAddressLine(address.getAddressLine());
        dto.setCity(address.getCity());
        dto.setProvince(address.getProvince());
        dto.setZipCode(address.getZipCode());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }

    @Transactional
    public AddressDto updateAddress(Integer userId, Integer addressId, AddressDto addressDto) {
        // 1. Find the address
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // 2. Security Check: Prevent changing someone else's address
        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied: Address does not belong to user");
        }

        // 3. Update fields
        address.setAddressLine(addressDto.getAddressLine());
        address.setCity(addressDto.getCity());
        address.setProvince(addressDto.getProvince());
        address.setZipCode(addressDto.getZipCode());

        // 4. Handle "Default" toggle
        // If the user wants this to be the new default, we must unset the old one
        if (Boolean.TRUE.equals(addressDto.getIsDefault())) {
            unsetOtherDefaults(userId);
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }

        // 5. Save and Return
        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }
}