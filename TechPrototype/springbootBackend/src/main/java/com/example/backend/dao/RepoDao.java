package com.example.backend.dao;

import com.example.backend.DTOs.CreateRepoDTO;
import com.example.backend.domains.Folder;
import com.example.backend.domains.Repo;
import com.example.backend.domains.Tag;
import com.example.backend.domains.User;
import com.example.backend.repository.RepoRepo;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class RepoDao {
    @Resource
    RepoRepo repoRepo;

    @Autowired
    FolderDao folderDao;

    @Autowired
    UserDao userDao;

    @Autowired
    TagDao tagDao;

    public Repo findByPath(String path){
        return repoRepo.findByPath(path);
    }

    public Boolean checkByPath(String path){
        return repoRepo.findByPath(path) != null;
    }

    public Repo createByRepoDTO(CreateRepoDTO repoDTO){
        Folder folder = folderDao.createByPath(repoDTO.getPath());
        String[] pathSplit = repoDTO.getPath().split("/");
        List<Tag> tagList = new ArrayList<>();
        for(String tagName : repoDTO.getTagNameList()){
            tagList.add(tagDao.findOrCreateByName(tagName));
        }
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // 自定义日期格式
        String date = currentDate.format(formatter);
        Repo repo = new Repo(repoDTO.getPath(), pathSplit[pathSplit.length - 1],
                repoDTO.getIntroduction(), 0,
                repoDTO.getPublish(), date, folder, userDao.getByName(repoDTO.getUser().getName()),
                new ArrayList<>(), tagList);
        repoRepo.save(repo);
        return repo;
    }

    public List<Repo> findAllPublic(){
        return repoRepo.findAllByPublish(true);
    }

    public List<Repo> findAllByUser(User user){
        return repoRepo.findAllByInitUser(user);
    }

    public void addStar(Repo repo){
        repo.setStar(repo.getStar() + 1);
        repoRepo.save(repo);
    }

    public void removeStar(Repo repo){
        repo.setStar(repo.getStar() - 1);
        repoRepo.save(repo);
    }

    public List<Repo> getRepoByNameDateLabelUser(String name, String begin, String end, List<String> tags, String user){
        List<Repo> repoList = repoRepo.findByUserNameDate(user, name, begin, end);
        List<Repo> repoHasTagList = new ArrayList<>();
        System.out.println(repoList);
        for(int i = 0; i < repoList.size(); i ++){
            List<Tag> tagList = repoList.get(i).getRepoTagList();
            if(tags.isEmpty() && tagList.isEmpty()){
                repoHasTagList.add(repoList.get(i));
            }
            for(int j = 0; j < tagList.size(); j ++){
                if(tags.isEmpty() || tags.contains(tagList.get(j).getName())){
                    repoHasTagList.add(repoList.get(i));
                    break;
                }
            }
        }
        return repoHasTagList;
    }
}
