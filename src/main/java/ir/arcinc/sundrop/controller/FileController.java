package ir.arcinc.sundrop.controller;

import ir.arcinc.sundrop.model.File;
import ir.arcinc.sundrop.service.FileService;
import ir.arcinc.sundrop.viewmodel.FileUploadViewModel;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.security.Principal;
import java.util.List;

/**
 * Created by tahae on 7/19/2017.
 */
@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileService fileService;
    /**
     * Upload multiple file using Spring Controller
     */
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public File uploadMultipleFileHandler(Principal user, @RequestParam("name") String name, @RequestParam("parentDir") Long parentDir, @RequestParam("file") MultipartFile file) throws Exception {
        return fileService.saveFile(user.getName(), parentDir, name, file);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public void getFile(Principal user, @PathVariable("id") Long id, HttpServletResponse response) throws Exception {
        String path = fileService.getPath(id);
        java.io.File file = new java.io.File(path);
        IOUtils.copy(new FileInputStream(file), response.getOutputStream());
        response.flushBuffer();
    }

    @RequestMapping(value = "/info/{id}", method = RequestMethod.GET)
    public File fileInfo(Principal user, @PathVariable("id") Long id) throws Exception {
        return fileService.getInfo(user.getName(), id);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public boolean getFile(Principal user, @PathVariable("id") Long id) throws Exception {
            fileService.deleteFile(user.getName(),id);
            return true;
    }

    @RequestMapping(value = "/parent/{id}", method = RequestMethod.GET)
    public Long getParent(Principal user, @PathVariable("id") Long id) throws Exception {
        return fileService.getParent(user.getName(), id);
    }
}
