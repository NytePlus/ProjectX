package com.example.backend.dao;

import com.example.backend.repository.CommentRepo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class CommentDao {
    @Resource
    CommentRepo commentRepo;
}
