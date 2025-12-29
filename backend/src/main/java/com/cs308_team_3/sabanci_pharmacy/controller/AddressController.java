package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.User.AddressDto;
import com.cs308_team_3.sabanci_pharmacy.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // Get all addresses for a user
    @GetMapping("/{userId}")
    public List<AddressDto> getUserAddresses(@PathVariable Integer userId) {
        return addressService.getUserAddresses(userId);
    }

    // Add a new address
    @PostMapping("/{userId}")
    public ResponseEntity<AddressDto> addAddress(@PathVariable Integer userId, @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.addAddress(userId, addressDto));
    }

    // Delete an address
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Integer addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/{addressId}")
    public ResponseEntity<AddressDto> updateAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId,
            @RequestBody AddressDto addressDto) {

        return ResponseEntity.ok(addressService.updateAddress(userId, addressId, addressDto));
    }
}