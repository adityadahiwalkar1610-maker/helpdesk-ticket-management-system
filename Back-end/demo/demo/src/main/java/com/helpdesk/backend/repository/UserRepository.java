//
//package com.helpdesk.backend.repository;
//
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.helpdesk.backend.entity.User;
//
//public interface UserRepository
//        extends JpaRepository<User, Long> {
//
//    Optional<User> findByEmail(String email);
//
//    boolean existsByEmail(String email);
//}




//checks for duplicate email.

package com.helpdesk.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.helpdesk.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);//automatic created dont have to write manually sql query

    boolean existsByEmail(String email);// automatic created dont have to write manually sql query
}



//package com.helpdesk.backend.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import com.helpdesk.backend.entity.User;
//
//public interface UserRepository extends JpaRepository<User, Long> {
//
//}
